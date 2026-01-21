import { Mode } from "@shared/storage/types"
import { Cpu, Network, ToggleLeft, ToggleRight } from "lucide-react"
import { useState } from "react"

interface TarxMeshProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

export const TarxMeshProvider = ({ showModelOptions, isPopup, currentMode }: TarxMeshProviderProps) => {
	const [superComputerEnabled, setSuperComputerEnabled] = useState(false)

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			{/* TARX Local - Always On */}
			<div
				style={{
					padding: "12px 14px",
					backgroundColor: "var(--vscode-editor-inactiveSelectionBackground)",
					borderRadius: "6px",
					border: "1px solid var(--vscode-panel-border)",
				}}>
				<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
					<Cpu className="size-5" style={{ color: "var(--vscode-charts-green)" }} />
					<div style={{ flex: 1 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ fontWeight: 600, color: "var(--vscode-foreground)" }}>TX-Local</span>
							<span
								style={{
									fontSize: 10,
									padding: "2px 6px",
									backgroundColor: "var(--vscode-charts-green)",
									color: "white",
									borderRadius: "4px",
									fontWeight: 500,
								}}>
								Always On
							</span>
						</div>
						<div style={{ fontSize: 12, color: "var(--vscode-descriptionForeground)", marginTop: 2 }}>
							tarx/TX-16G
						</div>
					</div>
					<div
						style={{
							width: 20,
							height: 20,
							borderRadius: "50%",
							backgroundColor: "var(--vscode-charts-green)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<span style={{ color: "white", fontSize: 12 }}>✓</span>
					</div>
				</div>
				<p style={{ fontSize: 12, color: "var(--vscode-descriptionForeground)", margin: 0 }}>
					Local inference on your machine. Zero latency, complete privacy, unlimited usage.
				</p>
			</div>

			{/* TARX SuperComputer - Toggle */}
			<div
				style={{
					padding: "12px 14px",
					backgroundColor: superComputerEnabled
						? "rgba(76, 175, 80, 0.1)"
						: "var(--vscode-editor-inactiveSelectionBackground)",
					borderRadius: "6px",
					border: superComputerEnabled
						? "1px solid var(--vscode-charts-green)"
						: "1px solid var(--vscode-panel-border)",
					transition: "all 0.2s ease",
				}}>
				<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
					<Network
						className="size-5"
						style={{
							color: superComputerEnabled ? "var(--vscode-charts-green)" : "var(--vscode-descriptionForeground)",
						}}
					/>
					<div style={{ flex: 1 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<span style={{ fontWeight: 600, color: "var(--vscode-foreground)" }}>TX-SuperComputer</span>
							<span
								style={{
									fontSize: 10,
									padding: "2px 6px",
									backgroundColor: superComputerEnabled
										? "var(--vscode-charts-green)"
										: "var(--vscode-descriptionForeground)",
									color: "white",
									borderRadius: "4px",
									fontWeight: 500,
								}}>
								{superComputerEnabled ? "Active" : "Off"}
							</span>
						</div>
						<div style={{ fontSize: 12, color: "var(--vscode-descriptionForeground)", marginTop: 2 }}>
							tarx/TX-M-72B
						</div>
					</div>
					<button
						onClick={() => setSuperComputerEnabled(!superComputerEnabled)}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: 0,
							display: "flex",
							alignItems: "center",
						}}>
						{superComputerEnabled ? (
							<ToggleRight className="size-7" style={{ color: "var(--vscode-charts-green)" }} />
						) : (
							<ToggleLeft className="size-7" style={{ color: "var(--vscode-descriptionForeground)" }} />
						)}
					</button>
				</div>
				<p style={{ fontSize: 12, color: "var(--vscode-descriptionForeground)", margin: 0 }}>
					{superComputerEnabled
						? "Connected to P2P mesh network. Access larger models for complex tasks."
						: "Enable to tap into distributed compute for complex tasks requiring TX-M-72B."}
				</p>
			</div>

			{/* Info text */}
			<p style={{ fontSize: 11, color: "var(--vscode-descriptionForeground)", margin: "4px 0 0 0" }}>
				TARX runs 100% locally. No API keys required. No data leaves your machine.
			</p>
		</div>
	)
}
