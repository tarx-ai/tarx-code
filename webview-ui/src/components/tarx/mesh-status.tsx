/**
 * TARX SuperComputer Status Badge
 *
 * Shows the current status of the TARX SuperComputer connection.
 * Displays "Connected to SuperComputer" when connected, simplified messaging when not.
 */

import { useCallback, useEffect, useState } from "react"

interface SuperComputerStatus {
	connected: boolean
	peerCount: number
	lastChecked: number
}

const TARX_API_URL = "http://localhost:11435"
const CHECK_INTERVAL_MS = 10000 // 10 seconds

export function MeshStatusBadge() {
	const [status, setStatus] = useState<SuperComputerStatus | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const checkStatus = useCallback(async () => {
		try {
			const response = await fetch(`${TARX_API_URL}/health`, {
				signal: AbortSignal.timeout(3000),
			})

			if (response.ok) {
				setStatus({
					connected: true,
					peerCount: 1,
					lastChecked: Date.now(),
				})
			} else {
				setStatus({
					connected: false,
					peerCount: 0,
					lastChecked: Date.now(),
				})
			}
		} catch {
			setStatus({
				connected: false,
				peerCount: 0,
				lastChecked: Date.now(),
			})
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		checkStatus()
		const interval = setInterval(checkStatus, CHECK_INTERVAL_MS)
		return () => clearInterval(interval)
	}, [checkStatus])

	if (isLoading) {
		return (
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: "4px",
					padding: "2px 8px",
					borderRadius: "9999px",
					backgroundColor: "var(--vscode-badge-background)",
					color: "var(--vscode-badge-foreground)",
					fontSize: "11px",
				}}>
				<span
					style={{
						width: "6px",
						height: "6px",
						borderRadius: "50%",
						backgroundColor: "var(--vscode-charts-yellow)",
					}}
				/>
				Connecting...
			</div>
		)
	}

	if (!status) return null

	const isConnected = status.connected

	return (
		<div
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: "4px",
				padding: "2px 8px",
				borderRadius: "9999px",
				backgroundColor: "var(--vscode-badge-background)",
				color: "var(--vscode-badge-foreground)",
				fontSize: "11px",
				cursor: "default",
			}}
			title={isConnected ? "Connected to TARX SuperComputer" : "TARX desktop app not detected"}>
			<span
				style={{
					width: "6px",
					height: "6px",
					borderRadius: "50%",
					backgroundColor: isConnected ? "var(--vscode-charts-green, #4caf50)" : "var(--vscode-charts-red, #f44336)",
				}}
			/>
			{isConnected ? "SuperComputer" : "Not Connected"}
		</div>
	)
}

export function MeshStatusIndicator() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "8px",
			}}>
			<MeshStatusBadge />
		</div>
	)
}
