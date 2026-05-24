// LIBRARIES
import { v } from 'convex/values';
import { internalMutation } from '@/convex/_generated/server';
import { convexRateLimiter } from '@/convex/convexRateLimiter';

// TYPES
import type { ConvexRateLimitName } from '@/convex/rateLimits/registry';

/** Internal enforcement for {@link convexCreateRateLimit} (no mutation ctx on BA hooks). */
export const convexCreateRateLimitInternal = internalMutation({
	args: {
		name: v.string(),
		key: v.string()
	},
	handler: async (ctx, { name, key }) => {
		await convexRateLimiter.limit(ctx, name as ConvexRateLimitName, { key, throws: true });
	}
});
