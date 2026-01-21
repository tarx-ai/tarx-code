/**
 * List of email domains that are considered trusted testers for TARX.
 */
const TARX_TRUSTED_TESTER_DOMAINS = ["tarx.com"]

/**
 * Checks if the given email belongs to a TARX internal user.
 * E.g. Emails ending with @tarx.com
 */
export function isTarxInternalUser(email: string): boolean {
	return email.endsWith("@tarx.com")
}

export function isTarxInternalTester(email: string): boolean {
	return isTarxInternalUser(email) || TARX_TRUSTED_TESTER_DOMAINS.some((d) => email.endsWith(`@${d}`))
}
