// LIBRARIES
import { ConvexError } from 'convex/values';
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { convexRateLimiter } from '@/convex/convexRateLimiter';

// TYPES
import type { ActionCtx, MutationCtx } from '@/convex/_generated/server';
import type { ConvexRateLimitName } from '@/convex/rateLimits/registry';
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';

/** Assert auth AND charge {@link convexRateLimiter} keyed by user id. */
export const convexGetRateLimitedUserId = async (
	ctx: MutationCtx | ActionCtx,
	name: ConvexRateLimitName,
	count?: number
): Promise<string> => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError({
			code: 'NOT_AUTHENTICATED',
			message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
		} satisfies ConvexErrorPayload);
	}

	await convexRateLimiter.limit(ctx, name, { key: userId, count, throws: true });
	return userId;
};
