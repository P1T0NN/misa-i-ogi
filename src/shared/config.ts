/**
 * Shared project configuration for the Convex backend and SvelteKit client.
 *
 * - `FEATURES`: runtime feature flags. Toggle subsystems on/off in one place.
 * - `GUEST_STAY`: guest stay window after scanning the in-room QR (`guests` table + HttpOnly cookie).
 *
 * Branding/contact strings live in `COMPANY_DATA` (`src/shared/constants.ts`).
 */
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

export const PAGINATION_DATA = {
	DEFAULT_PAGE_SIZE: 10,
	/** Server-side cap for `paginationOpts.numItems` (e.g. search dropdowns). */
	MAX_PAGE_SIZE: 25,
	/** Default for `DataTable` `optimizationStrategy` (see `DataTableOptimizationStrategy` in data-table `types.ts`). */
	DEFAULT_OPTIMIZATION_STRATEGY: 'cursor' as const
} as const;

export const COOKIE_NAMES = {
	SESSION_TOKEN: 'session_token',
	DEVICE_FINGERPRINT: 'device_fingerprint',
	GUEST_STAY: 'mygradly_guest_stay'
} as const;

export const GUEST_STAY = {
	DURATION_MS: 7 * 24 * 60 * 60 * 1000,
	DURATION_SECONDS: 7 * 24 * 60 * 60
} as const;

/** Guest-facing partnership offer label max length (server + client). */
export const PARTNERSHIP_BENEFIT_MAX_LENGTH = 15;

/**
 * Launch switch for the custom-partnership flow (feature is built but hidden
 * to keep the initial owner experience simple). Flip to `true` to release it.
 * To remove the switch for good: grep this name and delete each guard —
 * partnerships-header, partnerships-tab-empty, the create-custom-partnership
 * route guard (`+page.ts`), and the `createCustomPartnership` mutation.
 */
export const CUSTOM_PARTNERSHIP_ENABLED = false;

/**
 * Routes instrumented by `initBotId` on the client and verified by
 * `checkBotId` on the server via `safeCommand`.
 *
 * SvelteKit remote functions POST to `/_app/remote/<hash>/call`. With locale
 * prefixes (Paraglide), the path becomes `/<locale>/_app/remote/<hash>/call`.
 */
export const BOTID_PROTECTED_ROUTES = [
	{ path: '/_app/remote/*', method: 'POST' as const },
	{ path: '/*/_app/remote/*', method: 'POST' as const }
];
