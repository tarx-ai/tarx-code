/**
 * TARX Header Component
 *
 * Displays the TARX Code branding and mesh status in the chat header.
 */

import { MeshStatusBadge } from "./mesh-status"

interface TarxHeaderProps {
	showMeshStatus?: boolean
}

export function TarxHeader({ showMeshStatus = true }: TarxHeaderProps) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "8px 12px",
				borderBottom: "1px solid var(--vscode-panel-border)",
				backgroundColor: "var(--vscode-sideBar-background)",
			}}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "8px",
				}}>
				<span
					style={{
						fontWeight: 600,
						fontSize: "14px",
						color: "var(--vscode-foreground)",
					}}>
					TARX Code
				</span>
				<span
					style={{
						fontSize: "11px",
						color: "var(--vscode-descriptionForeground)",
						padding: "1px 6px",
						borderRadius: "4px",
						backgroundColor: "var(--vscode-badge-background)",
					}}>
					Local-First
				</span>
			</div>
			{showMeshStatus && <MeshStatusBadge />}
		</div>
	)
}

export function TarxFooter() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "4px 8px",
				fontSize: "10px",
				color: "var(--vscode-descriptionForeground)",
				borderTop: "1px solid var(--vscode-panel-border)",
			}}>
			<span>Local-first AI coding on TARX mesh</span>
		</div>
	)
}
