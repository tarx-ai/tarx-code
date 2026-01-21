import type { OnboardingModel } from "../proto/cline/state"

/**
 * TARX models available during onboarding.
 * TARX Local (always on) + TARX SuperComputer (mesh network toggle)
 */
export const CLINE_ONBOARDING_MODELS: OnboardingModel[] = [
	{
		group: "local",
		id: "tarx/tx-16g",
		name: "TARX Local: TX-16G",
		score: 95,
		latency: 1,
		badge: "Always On",
		info: {
			contextWindow: 32_768,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 0,
			outputPrice: 0,
			tiers: [],
		},
	},
	{
		group: "supercomputer",
		id: "tarx/tx-m-72b",
		name: "TARX SuperComputer: TX-M-72B",
		badge: "Mesh",
		score: 98,
		latency: 3,
		info: {
			contextWindow: 65_536,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 0,
			outputPrice: 0,
			tiers: [],
		},
	},
]
