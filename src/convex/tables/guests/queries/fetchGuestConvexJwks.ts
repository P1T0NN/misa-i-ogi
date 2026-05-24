// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// UTILS
import { getGuestConvexJwks } from '@/convex/tables/guests/utils/guestConvexJwt';

/** Public JWKS for Convex guest JWT verification (`auth.config.ts`). */
export const fetchGuestConvexJwks = query({
	args: {},
	returns: v.object({
		keys: v.array(
			v.object({
				kty: v.literal('EC'),
				crv: v.literal('P-256'),
				x: v.string(),
				y: v.string(),
				kid: v.string(),
				alg: v.literal('ES256'),
				use: v.literal('sig')
			})
		)
	}),
	handler: async () => getGuestConvexJwks()
});
