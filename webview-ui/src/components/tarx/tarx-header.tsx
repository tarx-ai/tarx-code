/**
 * TARX Header Component
 *
 * Displays the TARX CODE branding with icon and SuperComputer status.
 */

import { MeshStatusBadge } from "./mesh-status"

// TARX Logo as inline SVG for reliability
const TarxLogo = () => (
	<svg fill="none" height="24" viewBox="0 0 100 100" width="24" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" fill="url(#tarx-gradient)" r="45" />
		<path d="M30 40 Q50 30 70 40" fill="none" stroke="white" strokeLinecap="round" strokeWidth="4" />
		<circle cx="35" cy="45" fill="white" r="5" />
		<circle cx="65" cy="45" fill="white" r="5" />
		<path d="M35 60 Q50 70 65 60" fill="none" stroke="white" strokeLinecap="round" strokeWidth="4" />
		<defs>
			<linearGradient id="tarx-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
				<stop offset="0%" stopColor="#ff6b6b" />
				<stop offset="25%" stopColor="#feca57" />
				<stop offset="50%" stopColor="#48dbfb" />
				<stop offset="75%" stopColor="#ff9ff3" />
				<stop offset="100%" stopColor="#54a0ff" />
			</linearGradient>
		</defs>
	</svg>
)

interface TarxHeaderProps {
	showStatus?: boolean
}

export function TarxHeader({ showStatus = true }: TarxHeaderProps) {
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
				<TarxLogo />
				<span
					style={{
						fontWeight: 600,
						fontSize: "14px",
						color: "var(--vscode-foreground)",
					}}>
					TARX CODE
				</span>
			</div>
			{showStatus && <MeshStatusBadge />}
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
			<span>Powered by TARX SuperComputer</span>
		</div>
	)
}
