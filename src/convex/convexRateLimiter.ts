// LIBRARIES
import { RateLimiter } from '@convex-dev/rate-limiter';
import { components } from '@/convex/_generated/api';
import { convexRateLimitRegistry } from '@/convex/rateLimits/registry';

/**
 * App rate limiter backed by {@link convexRateLimitRegistry}.
 *
 * For authenticated writes prefer {@link convexGetRateLimitedUserId}.
 * For anonymous/IP-keyed endpoints use {@link enforceRateLimit} with an explicit key.
 */
export const convexRateLimiter = new RateLimiter(components.rateLimiter, convexRateLimitRegistry);

export type { ConvexRateLimitName } from '@/convex/rateLimits/registry';
