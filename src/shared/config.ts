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

/** Matches {@link GUEST_STAY_DURATION_MS} in `src/convex/projectSettings.ts`. */
export const GUEST_STAY = {
	DURATION_MS: 7 * 24 * 60 * 60 * 1000,
	DURATION_SECONDS: 7 * 24 * 60 * 60
} as const;

/** Guest-facing partnership offer label max length (server + client). */
export const PARTNERSHIP_BENEFIT_MAX_LENGTH = 15;

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
