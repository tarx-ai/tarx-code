import type { EmptyRequest } from "@shared/proto/cline/common"
import { Boolean as BooleanProto } from "@shared/proto/cline/common"
import type { Controller } from "../index"

const TARX_HEALTH_URL = "http://localhost:11435/health"
const TIMEOUT_MS = 3000

/**
 * Checks if TARX app is running and healthy
 * @param controller The controller instance
 * @param _request Empty request
 * @returns Boolean indicating if TARX is healthy
 */
export async function checkTarxHealth(_controller: Controller, _request: EmptyRequest): Promise<BooleanProto> {
	console.log("[TARX Health] Starting health check...")
	try {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

		console.log(`[TARX Health] Fetching ${TARX_HEALTH_URL}...`)
		const response = await fetch(TARX_HEALTH_URL, {
			method: "GET",
			signal: controller.signal,
		})

		clearTimeout(timeoutId)

		const isHealthy = response.ok
		console.log(`[TARX Health] Result: ${isHealthy ? "HEALTHY" : "UNHEALTHY"} (status: ${response.status})`)

		return BooleanProto.create({ value: isHealthy })
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : "Unknown error"
		console.log(`[TARX Health] FAILED: ${errorMsg}`)
		return BooleanProto.create({ value: false })
	}
}
