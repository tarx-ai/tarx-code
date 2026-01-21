import type { BooleanRequest } from "@shared/proto/cline/common"
import { Empty } from "@shared/proto/cline/common"
import type { Controller } from "../index"

/**
 * Sets the welcomeViewCompleted flag to the specified boolean value
 * @param controller The controller instance
 * @param request The boolean request containing the value to set
 * @returns Empty response
 */
export async function setWelcomeViewCompleted(controller: Controller, request: BooleanRequest): Promise<Empty> {
	console.log(`[setWelcomeViewCompleted] Called with value: ${request.value}`)
	try {
		// Update the global state to set welcomeViewCompleted to the requested value
		console.log("[setWelcomeViewCompleted] Updating global state...")
		controller.stateManager.setGlobalState("welcomeViewCompleted", request.value)

		console.log("[setWelcomeViewCompleted] Posting state to webview...")
		await controller.postStateToWebview()

		console.log(`[setWelcomeViewCompleted] Successfully set welcomeViewCompleted to: ${request.value}`)
		return Empty.create({})
	} catch (error) {
		console.error("[setWelcomeViewCompleted] Failed:", error)
		throw error
	}
}
