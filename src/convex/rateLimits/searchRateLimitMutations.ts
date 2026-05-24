// LIBRARIES
import { ConvexError, v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';
import { convexRateLimiter } from '@/convex/convexRateLimiter';
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { convexRateLimitRegistry } from '@/convex/rateLimits/registry';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { ConvexRateLimitName } from '@/convex/rateLimits/registry';

const SEARCH_LIMIT_SECRET_ENV = 'SEARCH_INPUT_RATE_LIMIT_SECRET';
const AUTHENTICATED_KEY_MODES = ['user', 'fallback', 'userAndFallback'] as const;

type AuthenticatedKeyMode = (typeof AUTHENTICATED_KEY_MODES)[number];

/** Trusted server-side bridge for public search rate limits. */
export const consumeSearchRateLimit = mutation({
	args: {
		name: v.string(),
		source: v.string(),
		fallbackKey: v.string(),
		authenticatedKey: v.union(
			v.literal('user'),
			v.literal('fallback'),
			v.literal('userAndFallback')
		),
		secret: v.string()
	},
	handler: async (ctx, args) => {
		const expectedSecret = process.env[SEARCH_LIMIT_SECRET_ENV];
		if (!expectedSecret) {
			throw new Error(`[consumeSearchRateLimit] Missing ${SEARCH_LIMIT_SECRET_ENV}.`);
		}

		if (args.secret !== expectedSecret) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: { key: 'GenericMessages.FORBIDDEN' }
			} satisfies ConvexErrorPayload);
		}

		if (!(args.name in convexRateLimitRegistry)) {
			throw new Error(`[consumeSearchRateLimit] Unknown rate-limit bucket "${args.name}".`);
		}

		const userId = await getAuthUserId(ctx);
		const key = resolveSearchRateLimitKey({
			source: args.source,
			fallbackKey: args.fallbackKey,
			authenticatedKey: args.authenticatedKey,
			userId
		});

		await convexRateLimiter.limit(ctx, args.name as ConvexRateLimitName, {
			key,
			throws: true
		});
	}
});

function resolveSearchRateLimitKey({
	source,
	fallbackKey,
	authenticatedKey,
	userId
}: {
	source: string;
	fallbackKey: string;
	authenticatedKey: AuthenticatedKeyMode;
	userId: string | null;
}): string {
	if (!userId) return fallbackKey;

	if (authenticatedKey === 'fallback') return fallbackKey;
	if (authenticatedKey === 'userAndFallback') {
		return `search-input:${source}:user:${userId}:fallback:${fallbackKey}`;
	}

	return `search-input:${source}:user:${userId}`;
}
