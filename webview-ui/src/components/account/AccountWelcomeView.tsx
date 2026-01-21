import tarxLogo from "@/assets/tarx-logo.png"

/**
 * TARX Account Welcome View
 *
 * TARX is local-first and doesn't require authentication for basic usage.
 * This view explains the local-first approach and optional cloud features.
 */
export const AccountWelcomeView = () => {
	return (
		<div className="flex flex-col items-center pr-3 gap-4">
			<img alt="TARX" className="rounded-xl" height={64} src={tarxLogo} width={64} />

			<div className="text-center">
				<h2 className="text-lg font-semibold text-foreground m-0 mb-2">TARX Local Mode</h2>
				<p className="text-sm text-muted-foreground m-0">
					TARX runs locally on your machine — no account required for local inference.
				</p>
			</div>

			<div className="w-full p-4 rounded-lg bg-card border border-border">
				<h3 className="text-sm font-medium text-foreground m-0 mb-2">Current Features</h3>
				<ul className="text-sm text-muted-foreground space-y-1 m-0 pl-4">
					<li>Local AI inference via TARX app</li>
					<li>100% private — your code stays on your machine</li>
					<li>No subscription or API keys needed</li>
				</ul>
			</div>

			<div className="w-full p-4 rounded-lg bg-secondary/50 border border-border">
				<h3 className="text-sm font-medium text-foreground m-0 mb-2">Coming Soon</h3>
				<ul className="text-sm text-muted-foreground space-y-1 m-0 pl-4">
					<li>SuperComputer Network — distributed AI power</li>
					<li>Enterprise Cloud fallback for larger models</li>
					<li>Earn credits by contributing compute</li>
				</ul>
			</div>

			<p className="text-xs text-muted-foreground text-center m-0 mt-2">
				Start the TARX app to begin coding with local AI.
			</p>
		</div>
	)
}
