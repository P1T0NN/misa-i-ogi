// LIBRARIES
import { v } from 'convex/values';

// UTILS
import { action } from '@/convex/_generated/server';
import { api } from '@/convex/_generated/api';
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
		guestStayCookie: v.string()
	},
	returns: createGuestConvexAuthTokenResult,
	handler: async (ctx, args): Promise<CreateGuestConvexAuthTokenResult> => {
		const currentGuest = await ctx.runQuery(
			api.tables.guests.queries.fetchGuestSessionFromCookie.fetchGuestSessionFromCookie,
			{ guestStayCookie: args.guestStayCookie }
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
