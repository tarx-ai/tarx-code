import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { Brain, Cpu, Network, Shield, Terminal, Wrench } from "lucide-react"
import tarxLogo from "@/assets/tarx-logo.png"
import Section from "../Section"

interface AboutSectionProps {
	version: string
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const FeatureItem = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
	<div className="flex gap-3 items-start">
		<div
			style={{
				padding: "8px",
				backgroundColor: "var(--vscode-editor-inactiveSelectionBackground)",
				borderRadius: "8px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<Icon className="size-4" style={{ color: "var(--vscode-charts-green)" }} />
		</div>
		<div>
			<div style={{ fontWeight: 600, color: "var(--vscode-foreground)", marginBottom: 2 }}>{title}</div>
			<div style={{ fontSize: 12, color: "var(--vscode-descriptionForeground)" }}>{description}</div>
		</div>
	</div>
)

const AboutSection = ({ version, renderSectionHeader }: AboutSectionProps) => {
	return (
		<div>
			{renderSectionHeader("about")}
			<Section>
				<div className="flex px-4 flex-col gap-4">
					{/* Header with Logo */}
					<div className="flex items-center gap-4">
						<img alt="TARX" height={56} src={tarxLogo} style={{ borderRadius: "12px" }} width={56} />
						<div>
							<h2 className="text-xl font-bold m-0" style={{ color: "var(--vscode-foreground)" }}>
								TARX CODE
							</h2>
							<div style={{ fontSize: 13, color: "var(--vscode-descriptionForeground)" }}>
								Version {version} • Local-first AI coding assistant
							</div>
						</div>
					</div>

					{/* Tagline */}
					<div
						style={{
							padding: "12px 16px",
							backgroundColor: "rgba(76, 175, 80, 0.1)",
							border: "1px solid rgba(76, 175, 80, 0.2)",
							borderRadius: "8px",
							fontSize: 13,
						}}>
						Powered by <strong>TARX SuperComputer</strong> — run AI locally with zero cloud dependency, complete
						privacy, and unlimited usage.
					</div>

					{/* Features Grid */}
					<div>
						<h3 className="text-sm font-semibold mb-3" style={{ color: "var(--vscode-foreground)" }}>
							Core Features
						</h3>
						<div className="flex flex-col gap-3">
							<FeatureItem
								description="Deep codebase understanding with autonomous task execution"
								icon={Brain}
								title="Agentic Coding"
							/>
							<FeatureItem
								description="Always-on local inference with TX-16G model"
								icon={Cpu}
								title="TARX Local"
							/>
							<FeatureItem
								description="Distributed P2P compute for complex tasks with TX-M-72B"
								icon={Network}
								title="SuperComputer Network"
							/>
							<FeatureItem
								description="No data collection, encrypted prompts, 100% private"
								icon={Shield}
								title="Privacy First"
							/>
							<FeatureItem
								description="Full shell access with safe command execution"
								icon={Terminal}
								title="Terminal Integration"
							/>
							<FeatureItem
								description="Extend capabilities with Model Context Protocol tools"
								icon={Wrench}
								title="MCP Tools"
							/>
						</div>
					</div>

					{/* Links */}
					<div
						style={{
							paddingTop: 12,
							borderTop: "1px solid var(--vscode-panel-border)",
							display: "flex",
							gap: 16,
							flexWrap: "wrap",
						}}>
						<VSCodeLink href="https://tarx.com">tarx.com</VSCodeLink>
						<VSCodeLink href="https://tarx.com/docs">Documentation</VSCodeLink>
						<VSCodeLink href="https://github.com/tarx-ai/tarx-code">GitHub</VSCodeLink>
						<VSCodeLink href="https://github.com/tarx-ai/tarx-code/issues">Report Issue</VSCodeLink>
					</div>

					{/* Footer */}
					<div style={{ fontSize: 11, color: "var(--vscode-descriptionForeground)", textAlign: "center" }}>
						Built with passion for developers who value privacy and performance.
					</div>
				</div>
			</Section>
		</div>
	)
}

export default AboutSection
