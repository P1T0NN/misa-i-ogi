// LIBRARIES
import { v } from 'convex/values';

// UTILS
import { action } from '@/convex/_generated/server';
import { api, internal } from '@/convex/_generated/api';
import { assertTrustedServer } from '@/convex/auth/assertTrustedServer';
import { enforceRateLimit } from '@/convex/rateLimits/enforceRateLimit';
import { rateLimitKey } from '@/convex/rateLimits/keys';
import { createGuestConvexJwt } from '@/convex/tables/guests/utils/guestConvexJwt';
import { verifyGuestSessionCookie } from '@/convex/tables/guests/utils/guestStayCookieCrypto';

type CreateGuestConvexAuthTokenResult =
	| {
			token: string;
			sharingCode: string;
			signedCookie?: string;
			expiresAt?: number;
	  }
	| { status: 'missing' }
	| { status: 'expired' };

const createGuestConvexAuthTokenResult = v.union(
	v.object({
		token: v.string(),
		sharingCode: v.string(),
		signedCookie: v.optional(v.string()),
		expiresAt: v.optional(v.number())
	}),
	v.object({
		status: v.literal('missing')
	}),
	v.object({
		status: v.literal('expired')
	})
);

/** Validates the HttpOnly guest cookie and creates a short-lived Convex guest JWT. */
export const createGuestConvexAuthToken = action({
	args: {
		guestStayCookie: v.string(),
		ip: v.string(),
		secret: v.string()
	},
	returns: createGuestConvexAuthTokenResult,
	handler: async (ctx, args): Promise<CreateGuestConvexAuthTokenResult> => {
		// Trusted-server only (our /api/guest-auth/token route holds the secret),
		// then IP-metered — mirrors `createGuest`. Stops direct spamming of the JWT
		// mint via PUBLIC_CONVEX_URL and throttles per-IP on shared WiFi.
		assertTrustedServer(args.secret);
		await enforceRateLimit(ctx, 'guestTokenMint', rateLimitKey.ip(args.ip));

		const currentGuest = await ctx.runQuery(
			internal.tables.guests.queries.fetchGuestSessionFromCookieInternal
				.fetchGuestSessionFromCookieInternal,
			{ guestStayCookie: args.guestStayCookie, asOfMs: Date.now() }
		);

		if (currentGuest.status === 'missing') {
			return { status: 'missing' as const };
		}

		if (currentGuest.status !== 'active' || !currentGuest.guest) {
			return { status: 'expired' as const };
		}

		const token = await createGuestConvexJwt({
			guestId: currentGuest.guest._id,
			accommodationId: currentGuest.guest.accommodationId,
			sessionExpiresAt: currentGuest.guest.expiresAt
		});

		const payload = await verifyGuestSessionCookie(args.guestStayCookie);
		const sharingCode = payload?.sharingCode;

		if (!sharingCode) {
			const upgraded = await ctx.runMutation(
				api.tables.guests.mutations.createGuestSharingCode.createGuestSharingCode,
				{ guestStayCookie: args.guestStayCookie }
			);

			if ('signedCookie' in upgraded) {
				return {
					token,
					sharingCode: upgraded.sharingCode,
					signedCookie: upgraded.signedCookie,
					expiresAt: upgraded.expiresAt
				};
			}

			return { status: 'missing' as const };
		}

		return { token, sharingCode };
	}
});
