/**
 * TARX SuperComputer Provider
 *
 * Implements the ApiHandler interface to connect to TARX SuperComputer
 * for AI-powered coding assistance.
 */

import { type ModelInfo, openAiModelInfoSaneDefaults } from "@shared/api"
import { ClineStorageMessage } from "@/shared/messages/content"
import type { ApiHandler, CommonApiHandlerOptions } from "../"
import { withRetry } from "../retry"
import type { ApiStream } from "../transform/stream"

// Default endpoints
const DEFAULT_LLAMA_SERVER_URL = "http://localhost:11435"
const DEFAULT_MESH_API_URL = "http://localhost:11436"
const DEFAULT_MODEL = "tx-16g"
const DEFAULT_CONTEXT_WINDOW = 32768
const DEFAULT_MAX_TOKENS = 4096

export interface TarxMeshHandlerOptions extends CommonApiHandlerOptions {
	tarxLlamaServerUrl?: string
	tarxMeshApiUrl?: string
	tarxEnableMeshRouting?: boolean
	tarxEnableCloudFallback?: boolean
	tarxModel?: string
	requestTimeoutMs?: number
}

// Circuit breaker state
interface CircuitBreakerState {
	failures: number
	lastFailure: number
	state: "closed" | "open" | "half-open"
}

export class TarxMeshHandler implements ApiHandler {
	private options: TarxMeshHandlerOptions
	private circuitBreaker: CircuitBreakerState = {
		failures: 0,
		lastFailure: 0,
		state: "closed",
	}
	private abortController: AbortController | null = null

	constructor(options: TarxMeshHandlerOptions = {}) {
		this.options = {
			tarxLlamaServerUrl: DEFAULT_LLAMA_SERVER_URL,
			tarxMeshApiUrl: DEFAULT_MESH_API_URL,
			tarxEnableMeshRouting: true,
			tarxEnableCloudFallback: false,
			tarxModel: DEFAULT_MODEL,
			requestTimeoutMs: 120000,
			...options,
		}
	}

	@withRetry({ retryAllErrors: true })
	async *createMessage(systemPrompt: string, messages: ClineStorageMessage[]): ApiStream {
		this.abortController = new AbortController()

		// Build OpenAI-compatible message array
		const apiMessages = this.buildMessageArray(systemPrompt, messages)

		try {
			// Check if mesh should be used (based on query complexity)
			const useMesh = this.options.tarxEnableMeshRouting && (await this.shouldUseMesh(apiMessages))

			if (useMesh) {
				try {
					yield* this.streamFromMesh(apiMessages)
					return
				} catch (meshError) {
					console.warn("Mesh query failed, falling back to local:", meshError)
					// Fall through to local llama-server
				}
			}

			// Default: local llama-server
			yield* this.streamFromLlamaServer(apiMessages)
		} catch (error) {
			// Record circuit breaker failure
			this.recordFailure()

			if (this.options.tarxEnableCloudFallback && this.circuitBreaker.state === "open") {
				throw new Error("Local inference unavailable. Cloud fallback disabled by policy.")
			}

			throw error
		}
	}

	/**
	 * Stream from local llama-server (OpenAI-compatible API)
	 */
	private async *streamFromLlamaServer(messages: Array<{ role: string; content: string }>): ApiStream {
		const timeoutMs = this.options.requestTimeoutMs || 120000

		const response = await fetch(`${this.options.tarxLlamaServerUrl}/v1/chat/completions`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: this.options.tarxModel,
				messages,
				stream: true,
				max_tokens: DEFAULT_MAX_TOKENS,
			}),
			signal: this.abortController?.signal,
		})

		if (!response.ok) {
			const errorText = await response.text().catch(() => "")
			throw new Error(`llama-server error: ${response.status} ${errorText}`)
		}

		const reader = response.body?.getReader()
		if (!reader) throw new Error("No response body from llama-server")

		const decoder = new TextDecoder()
		let inputTokens = 0
		let outputTokens = 0
		let buffer = ""

		// Set up timeout
		const timeoutId = setTimeout(() => {
			this.abortController?.abort()
		}, timeoutMs)

		try {
			while (true) {
				const { done, value } = await reader.read()
				if (done) break

				buffer += decoder.decode(value, { stream: true })
				const lines = buffer.split("\n")
				buffer = lines.pop() ?? ""

				for (const line of lines) {
					if (line.startsWith("data: ") && !line.includes("[DONE]")) {
						try {
							const json = JSON.parse(line.slice(6))
							// Handle both content and reasoning_content (some models use reasoning_content)
							const delta = json.choices?.[0]?.delta?.content || json.choices?.[0]?.delta?.reasoning_content

							if (delta) {
								outputTokens++
								yield { type: "text", text: delta }
							}

							// Capture usage if provided
							if (json.usage) {
								inputTokens = json.usage.prompt_tokens || inputTokens
								outputTokens = json.usage.completion_tokens || outputTokens
							}
						} catch {
							// Skip malformed JSON
						}
					}
				}
			}

			// Record success for circuit breaker
			this.recordSuccess()

			// Yield final usage chunk
			yield {
				type: "usage",
				inputTokens,
				outputTokens,
			}
		} finally {
			clearTimeout(timeoutId)
		}
	}

	/**
	 * Stream from TARX mesh network
	 */
	private async *streamFromMesh(messages: Array<{ role: string; content: string }>): ApiStream {
		const userMessage = messages[messages.length - 1]?.content || ""
		const systemMessage = messages.find((m) => m.role === "system")?.content

		const response = await fetch(`${this.options.tarxMeshApiUrl}/mesh/query/stream`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "text/event-stream",
			},
			body: JSON.stringify({
				model: this.options.tarxModel,
				prompt: userMessage,
				systemPrompt: systemMessage,
				stream: true,
				timeout: this.options.requestTimeoutMs,
			}),
			signal: this.abortController?.signal,
		})

		if (!response.ok) {
			throw new Error(`Mesh query failed: ${response.status}`)
		}

		const reader = response.body?.getReader()
		if (!reader) throw new Error("No response body from mesh")

		const decoder = new TextDecoder()
		let buffer = ""
		let totalTokens = 0

		while (true) {
			const { done, value } = await reader.read()
			if (done) break

			buffer += decoder.decode(value, { stream: true })
			const lines = buffer.split("\n")
			buffer = lines.pop() ?? ""

			for (const line of lines) {
				if (line.startsWith("data: ")) {
					const data = line.slice(6)
					if (data === "[DONE]") {
						// Yield usage and return
						yield {
							type: "usage",
							inputTokens: 0,
							outputTokens: totalTokens,
						}
						return
					}

					try {
						const chunk = JSON.parse(data)
						if (chunk.content) {
							totalTokens++
							yield { type: "text", text: chunk.content }
						}
						if (chunk.done || chunk.error) {
							yield {
								type: "usage",
								inputTokens: 0,
								outputTokens: totalTokens,
							}
							return
						}
					} catch {
						// Skip malformed chunks
					}
				}
			}
		}

		// Yield final usage
		yield {
			type: "usage",
			inputTokens: 0,
			outputTokens: totalTokens,
		}
	}

	/**
	 * Determine if query should use mesh (complexity heuristics)
	 */
	private async shouldUseMesh(messages: Array<{ role: string; content: string }>): Promise<boolean> {
		// Check circuit breaker state
		if (this.circuitBreaker.state === "open") {
			const timeSinceFailure = Date.now() - this.circuitBreaker.lastFailure
			if (timeSinceFailure < 60000) return false // Wait 60s before retry
			this.circuitBreaker.state = "half-open"
		}

		// Check mesh availability
		try {
			const health = await fetch(`${this.options.tarxMeshApiUrl}/mesh/status`, {
				signal: AbortSignal.timeout(2000),
			})
			if (!health.ok) return false

			const status = (await health.json()) as { running?: boolean; peerCount?: number; peer_count?: number }
			const peerCount = status.peerCount ?? status.peer_count ?? 0
			if (!status.running || peerCount === 0) return false
		} catch {
			return false
		}

		// Complexity heuristics - use mesh for complex queries
		const lastMessage = messages[messages.length - 1]?.content || ""
		const wordCount = lastMessage.split(/\s+/).length
		const charCount = lastMessage.length

		// Complexity indicators
		const complexityIndicators = [
			/analyze|evaluate|compare/i,
			/step[- ]by[- ]step/i,
			/implement|refactor|optimize/i,
			/debug|fix|resolve/i,
			/explain.*code|review.*code/i,
		]

		const isComplex = charCount > 500 || wordCount > 100 || complexityIndicators.some((pattern) => pattern.test(lastMessage))

		return isComplex
	}

	/**
	 * Build OpenAI-compatible message array
	 */
	private buildMessageArray(systemPrompt: string, messages: ClineStorageMessage[]): Array<{ role: string; content: string }> {
		const result: Array<{ role: string; content: string }> = []

		if (systemPrompt) {
			result.push({ role: "system", content: systemPrompt })
		}

		for (const msg of messages) {
			// Handle both string content and array content
			let textContent: string

			if (typeof msg.content === "string") {
				textContent = msg.content
			} else if (Array.isArray(msg.content)) {
				// Extract text content from Cline's content array structure
				textContent = msg.content
					.filter(
						(part): part is { type: "text"; text: string } =>
							typeof part === "object" && part !== null && part.type === "text" && "text" in part,
					)
					.map((part) => part.text)
					.join("\n")
			} else {
				continue
			}

			if (textContent) {
				result.push({ role: msg.role, content: textContent })
			}
		}

		return result
	}

	/**
	 * Record failure for circuit breaker
	 */
	private recordFailure(): void {
		this.circuitBreaker.failures++
		this.circuitBreaker.lastFailure = Date.now()

		if (this.circuitBreaker.failures >= 5) {
			this.circuitBreaker.state = "open"
		}
	}

	/**
	 * Record success for circuit breaker
	 */
	private recordSuccess(): void {
		if (this.circuitBreaker.state === "half-open") {
			this.circuitBreaker.state = "closed"
			this.circuitBreaker.failures = 0
		}
	}

	/**
	 * Get model information
	 */
	getModel(): { id: string; info: ModelInfo } {
		return {
			id: this.options.tarxModel || DEFAULT_MODEL,
			info: {
				...openAiModelInfoSaneDefaults,
				maxTokens: DEFAULT_MAX_TOKENS,
				contextWindow: DEFAULT_CONTEXT_WINDOW,
				supportsImages: false,
				supportsPromptCache: false,
				inputPrice: 0, // Free for local/mesh
				outputPrice: 0,
			},
		}
	}

	/**
	 * Abort current request
	 */
	abort(): void {
		this.abortController?.abort()
		this.abortController = null
	}
}
