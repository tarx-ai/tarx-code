/**
 * TARX Mesh Status Badge
 *
 * Shows the current status of the TARX mesh network connection.
 * Displays peer count when connected, "Local only" when mesh is unavailable.
 */

import { useCallback, useEffect, useState } from "react"

interface MeshStatus {
	connected: boolean
	peerCount: number
	lastChecked: number
}

const MESH_API_URL = "http://localhost:11436"
const CHECK_INTERVAL_MS = 10000 // 10 seconds

export function MeshStatusBadge() {
	const [status, setStatus] = useState<MeshStatus | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const checkMeshStatus = useCallback(async () => {
		try {
			const response = await fetch(`${MESH_API_URL}/mesh/status`, {
				signal: AbortSignal.timeout(3000),
			})

			if (response.ok) {
				const data = await response.json()
				setStatus({
					connected: data.running ?? false,
					peerCount: data.peerCount ?? data.peer_count ?? 0,
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
		checkMeshStatus()
		const interval = setInterval(checkMeshStatus, CHECK_INTERVAL_MS)
		return () => clearInterval(interval)
	}, [checkMeshStatus])

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
				Checking...
			</div>
		)
	}

	if (!status) return null

	const isConnected = status.connected && status.peerCount > 0

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
			title={
				isConnected
					? `Connected to TARX mesh with ${status.peerCount} peer(s)`
					: "Mesh unavailable - using local llama-server"
			}>
			<span
				style={{
					width: "6px",
					height: "6px",
					borderRadius: "50%",
					backgroundColor: isConnected ? "var(--vscode-charts-green, #4caf50)" : "var(--vscode-charts-gray, #9e9e9e)",
				}}
			/>
			{isConnected ? `${status.peerCount} peer${status.peerCount !== 1 ? "s" : ""}` : "Local only"}
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
			<span
				style={{
					fontSize: "12px",
					color: "var(--vscode-descriptionForeground)",
				}}>
				TARX
			</span>
			<MeshStatusBadge />
		</div>
	)
}
