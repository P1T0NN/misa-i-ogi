// LIBRARIES
import { ConvexError } from 'convex/values';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';

// Shared secret between the SvelteKit server and Convex. The same value already
// gates `consumeSearchRateLimit`; it marks a call as coming from our own server
// rather than a direct client hitting the public Convex URL.
const TRUSTED_SERVER_SECRET_ENV = 'SEARCH_INPUT_RATE_LIMIT_SECRET';

/**
 * Reject calls that don't carry our server-to-server secret.
 *
 * Public Convex mutations are reachable by anyone who knows `PUBLIC_CONVEX_URL`.
 * For mutations only ever invoked from the SvelteKit server (guest activation /
 * share-join), this keeps the trusted `ip` arg + per-IP rate limit honest.
 */
export function assertTrustedServer(secret: string): void {
	const expected = process.env[TRUSTED_SERVER_SECRET_ENV];
	if (!expected) {
		throw new Error(`[assertTrustedServer] Missing ${TRUSTED_SERVER_SECRET_ENV}.`);
	}

	if (secret !== expected) {
		throw new ConvexError({
			code: 'FORBIDDEN',
			message: { key: 'GenericMessages.FORBIDDEN' }
		} satisfies ConvexErrorPayload);
	}
}
