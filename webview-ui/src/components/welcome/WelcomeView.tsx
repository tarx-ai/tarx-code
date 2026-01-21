import { BooleanRequest, EmptyRequest, StringRequest } from "@shared/proto/cline/common"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import tarxLogo from "@/assets/tarx-logo.png"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient, UiServiceClient } from "@/services/grpc-client"

const RETRY_INTERVAL = 5 // seconds

const WelcomeView = memo(() => {
	const { setShowWelcome } = useExtensionState()
	const [tarxConnected, setTarxConnected] = useState<boolean | null>(null)
	const [checking, setChecking] = useState(true)
	const [countdown, setCountdown] = useState(RETRY_INTERVAL)
	const [showSuccess, setShowSuccess] = useState(false)
	const retryTimerRef = useRef<NodeJS.Timeout | null>(null)
	const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)

	const clearTimers = useCallback(() => {
		if (retryTimerRef.current) {
			clearTimeout(retryTimerRef.current)
			retryTimerRef.current = null
		}
		if (countdownTimerRef.current) {
			clearInterval(countdownTimerRef.current)
			countdownTimerRef.current = null
		}
	}, [])

	const checkTarxConnection = useCallback(async () => {
		console.log("[WelcomeView] Starting connection check...")
		clearTimers()
		setChecking(true)
		setCountdown(RETRY_INTERVAL)

		try {
			// Use extension RPC to check health (avoids CSP issues with direct fetch)
			console.log("[WelcomeView] Calling checkTarxHealth RPC...")
			const result = await UiServiceClient.checkTarxHealth(EmptyRequest.create({}))
			const connected = result.value
			console.log(`[WelcomeView] Health check result: ${connected}`)
			setTarxConnected(connected)

			if (connected) {
				// Show success animation briefly
				console.log("[WelcomeView] Connected! Showing success state...")
				setShowSuccess(true)
				setTimeout(async () => {
					console.log("[WelcomeView] Calling setWelcomeViewCompleted(true)...")
					await StateServiceClient.setWelcomeViewCompleted(BooleanRequest.create({ value: true }))
					console.log("[WelcomeView] setWelcomeViewCompleted done, calling setShowWelcome(false)...")
					setShowWelcome(false)
				}, 1000)
			} else {
				console.log("[WelcomeView] Not connected, starting retry countdown...")
				// Start auto-retry countdown
				startRetryCountdown()
			}
		} catch (error) {
			console.error("[WelcomeView] Failed to check TARX health:", error)
			setTarxConnected(false)
			// Start auto-retry countdown
			startRetryCountdown()
		} finally {
			setChecking(false)
		}
	}, [setShowWelcome, clearTimers])

	const startRetryCountdown = useCallback(() => {
		setCountdown(RETRY_INTERVAL)

		// Countdown timer
		countdownTimerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					return RETRY_INTERVAL
				}
				return prev - 1
			})
		}, 1000)

		// Retry timer
		retryTimerRef.current = setTimeout(() => {
			checkTarxConnection()
		}, RETRY_INTERVAL * 1000)
	}, [checkTarxConnection])

	useEffect(() => {
		checkTarxConnection()
		return () => clearTimers()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const handleDownload = async () => {
		try {
			await UiServiceClient.openUrl(StringRequest.create({ value: "https://tarx.com/download" }))
		} catch (error) {
			console.error("Failed to open download URL:", error)
			// Fallback to window.open if gRPC fails
			window.open("https://tarx.com/download", "_blank")
		}
	}

	const handleManualCheck = () => {
		clearTimers()
		checkTarxConnection()
	}

	// Checking connection - show spinner
	if (checking) {
		return (
			<div className="fixed inset-0 flex flex-col bg-background">
				<div className="h-full px-5 overflow-auto flex flex-col items-center justify-center gap-4">
					<img alt="TARX" className="rounded-xl" height={72} src={tarxLogo} width={72} />
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
						<p className="text-muted-foreground text-sm">Connecting to TARX...</p>
					</div>
				</div>
			</div>
		)
	}

	// Connected - show success animation
	if (showSuccess || tarxConnected) {
		return (
			<div className="fixed inset-0 flex flex-col bg-background">
				<div className="h-full px-5 overflow-auto flex flex-col items-center justify-center gap-4">
					<div className="relative">
						<img alt="TARX" className="rounded-xl" height={72} src={tarxLogo} width={72} />
						{/* Green checkmark overlay */}
						<div className="absolute -bottom-1 -right-1 w-7 h-7 bg-tarx rounded-full flex items-center justify-center animate-scale-in shadow-lg">
							<svg fill="none" height="16" stroke="white" strokeWidth="3" viewBox="0 0 24 24" width="16">
								<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
					</div>
					<div className="tarx-badge-success px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium">
						<span className="w-2 h-2 rounded-full bg-white" />
						Connected — ready to code!
					</div>
				</div>
			</div>
		)
	}

	// TARX Not Connected - Show full onboarding card with retry timer
	return (
		<div className="fixed inset-0 flex flex-col bg-background">
			<div className="h-full px-5 py-6 overflow-auto flex flex-col items-center gap-4">
				{/* Logo and Title */}
				<img alt="TARX" className="rounded-xl" height={72} src={tarxLogo} width={72} />
				<h1 className="text-xl font-bold text-center text-foreground">Start TARX to Unlock AI Coding Power</h1>
				<p className="text-center text-sm text-muted-foreground max-w-[360px]">
					TARX Code needs the TARX desktop app running.
				</p>

				{/* Why TARX Section */}
				<div className="tarx-card w-full max-w-[400px]">
					<div className="tarx-card-header py-3">
						<h3 className="font-semibold text-sm text-foreground">Why TARX?</h3>
					</div>
					<div className="tarx-card-content pt-0">
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex gap-2">
								<span>⚡</span>
								<span>
									<strong className="text-foreground">Free & Local-First</strong> — Powerful AI on your machine,
									no subscriptions
								</span>
							</li>
							<li className="flex gap-2">
								<span>🌐</span>
								<span>
									<strong className="text-foreground">SuperComputer Network</strong> — Earn credits, tap
									distributed power
								</span>
							</li>
							<li className="flex gap-2">
								<span>🔒</span>
								<span>
									<strong className="text-foreground">100% Private</strong> — No data collection, your code
									stays yours
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Coding Superpowers Section */}
				<div className="tarx-card w-full max-w-[400px]">
					<div className="tarx-card-header py-3">
						<h3 className="font-semibold text-sm text-foreground">Coding Superpowers</h3>
					</div>
					<div className="tarx-card-content pt-0">
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex gap-2">
								<span>🧠</span>
								<span>
									<strong className="text-foreground">Local RAG & Memory</strong> — Smarter refactors, bug
									fixes, completions
								</span>
							</li>
							<li className="flex gap-2">
								<span>🚀</span>
								<span>
									<strong className="text-foreground">Instant Speed</strong> — No cloud latency
								</span>
							</li>
							<li className="flex gap-2">
								<span>🛠️</span>
								<span>
									<strong className="text-foreground">Build Anything</strong> — Generate, debug, optimize with
									TARX
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* CTA */}
				<p className="text-center text-xs text-muted-foreground max-w-[360px]">
					Start the app or download from tarx.com — code like never before!
				</p>

				{/* Buttons */}
				<div className="flex flex-col items-center gap-3 mt-2">
					<div className="flex gap-3">
						<button className="tarx-btn tarx-btn-primary" onClick={handleManualCheck}>
							Check Connection
						</button>
						<button className="tarx-btn tarx-btn-secondary" onClick={handleDownload}>
							Download TARX
						</button>
					</div>

					{/* Retry countdown */}
					<div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
						<div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
						<span>Retrying in {countdown}s...</span>
					</div>
				</div>
			</div>
		</div>
	)
})

export default WelcomeView
