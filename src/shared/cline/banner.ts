/**
 * Action types that can be triggered from banner buttons/links
 * Frontend maps these to actual handlers
 */
export enum BannerActionType {
	/** Open external URL */
	Link = "link",
	/** Open API settings tab */
	ShowApiSettings = "show-api-settings",
	/** Open feature settings tab */
	ShowFeatureSettings = "show-feature-settings",
	/** Open account/login view */
	ShowAccount = "show-account",
	/** Set the active model */
	SetModel = "set-model",
	/** Trigger CLI installation flow */
	InstallCli = "install-cli",
	/** Enable TARX SuperComputer mode */
	EnableSuperComputer = "enable-supercomputer",
}

/**
 * Banner data structure for backend-to-frontend communication.
 * Backend constructs this JSON, frontend renders it via BannerCarousel.
 */
export interface BannerCardData {
	/** Unique identifier for the banner (used for dismissal tracking) */
	id: string

	/** Banner title text */
	title: string

	/** Banner description/body markdown text */
	description: string

	/**
	 * Icon ID from Lucide icon set (e.g., "lightbulb", "megaphone", "terminal")
	 * LINK: https://lucide.dev/icons/
	 * Optional - if omitted, no icon is shown
	 */
	icon?: string

	/**
	 * Optional footer action buttons
	 * Rendered below the description as prominent buttons
	 */
	actions?: BannerAction[]

	/**
	 * Platform filter - only show on specified platforms
	 * If undefined, show on all platforms
	 */
	platforms?: ("windows" | "mac" | "linux")[]

	/** Only show to TARX users */
	isTarxUserOnly?: boolean
}

/**
 * Single action definition (button or link)
 */
export interface BannerAction {
	/** Button/link label text */
	title: string

	/**
	 * Action type - determines what happens on click
	 * Defaults to "link" if omitted
	 */
	action?: BannerActionType

	/**
	 * Action argument - interpretation depends on action type:
	 * - Link: URL to open
	 * - SetModel: model ID (e.g., "anthropic/claude-opus-4.5")
	 * - Others: generally unused
	 */
	arg?: string
}

/**
 * The list of predefined banner config rendered by the Welcome Section UI.
 * TARX-specific banners for Local and SuperComputer modes.
 */
export const BANNER_DATA: BannerCardData[] = [
	// TARX Local - Always On
	{
		id: "tarx-local-intro-v1",
		icon: "cpu",
		title: "TARX Local — Always On",
		description:
			"Your local AI coding assistant runs entirely on your machine. Zero cloud latency, complete privacy, and unlimited usage. Powered by TX-16G model optimized for coding tasks.",
	},

	// TARX SuperComputer
	{
		id: "tarx-supercomputer-intro-v1",
		icon: "network",
		title: "TARX SuperComputer",
		description:
			"Tap into the distributed P2P network for complex tasks. Access TX-M-72B and larger models when you need extra power. Toggle on to join the mesh.",
		actions: [
			{
				title: "Enable SuperComputer",
				action: BannerActionType.EnableSuperComputer,
			},
		],
	},

	// Info banner with inline link
	{
		id: "info-banner-v1",
		icon: "lightbulb",
		title: "Use TARX Code in Right Sidebar",
		description:
			"For the best experience, drag the TARX icon to your right sidebar. This keeps your file explorer and editor visible while you chat with TARX, making it easier to navigate your codebase and see changes in real-time.",
	},
]
