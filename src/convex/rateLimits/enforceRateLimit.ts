import { ConvexError } from 'convex/values';
import { convexRateLimiter } from '@/convex/convexRateLimiter';

// TYPES
import type { ActionCtx, MutationCtx, QueryCtx } from '@/convex/_generated/server';
import type { ConvexRateLimitName } from '@/convex/rateLimits/registry';

type RateLimitCtx = MutationCtx | ActionCtx;
type CheckRateLimitCtx = QueryCtx | RateLimitCtx;

/** Consume tokens and throw `RateLimitError` when the bucket is empty. */
export async function enforceRateLimit(
	ctx: RateLimitCtx,
	name: ConvexRateLimitName,
	key: string,
	count = 1
): Promise<void> {
	await convexRateLimiter.limit(ctx, name, { key, count, throws: true });
}

/**
 * Advisory check for queries (does not consume tokens).
 * Throws a `ConvexError` recognized by `isRateLimitError` on the client.
 */
export async function checkRateLimit(
	ctx: CheckRateLimitCtx,
	name: ConvexRateLimitName,
	key: string,
	count = 1
): Promise<void> {
	const result = await convexRateLimiter.check(ctx, name, { key, count });
	if (result.ok) return;

	throw new ConvexError({
		kind: 'RateLimited',
		name,
		retryAfter: result.retryAfter
	});
}
