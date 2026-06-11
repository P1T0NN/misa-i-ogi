/**
 * Project-wide settings for the Convex backend.
 *
 * - `CONVEX_PROJECT_SETTINGS`: branding/contact strings used by emails, headers, etc.
 * - `FEATURES`: runtime feature flags. Toggle subsystems on/off in one place.
 *   Flags are evaluated at runtime in Convex functions and on the client.
 */
export const CONVEX_PROJECT_SETTINGS = {
	NAME: 'Company Name',
	RESEND_EMAIL: 'onboarding@resend.dev', // default email for the Resend provider
	EMAIL: 'ognjen.tapuskovic@gmail.com'
} as const;

/** Guest stay window after scanning the in-room QR (`guests` table + HttpOnly cookie). */
export const GUEST_STAY_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const FEATURES = {
	/**
	 * Enable audit logging. When `false`, `ctx.audit()` / `logAudit()` are no-ops
	 * and nothing is written to the `auditLogs` table.
	 *
	 * The table itself is always declared in the schema so toggling this flag
	 * does not require a schema migration.
	 */
	AUDIT_LOGS: true,

	/** This project uses Cloudflare R2 only (no Convex file storage). */
	USE_R2: true
} as const;
