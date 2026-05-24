// LIBRARIES
import { v } from 'convex/values';

// UTILS
import { action } from '@/convex/_generated/server';
import { api } from '@/convex/_generated/api';
import { createGuestConvexJwt } from '@/convex/tables/guests/utils/guestConvexJwt';

const mintGuestConvexAuthTokenResult = v.union(
	v.object({
		token: v.string()
	}),
	v.object({
		status: v.literal('missing')
	}),
	v.object({
		status: v.literal('expired')
	})
);

/** Validates the HttpOnly guest cookie and mints a short-lived Convex guest JWT. */
export const mintGuestConvexAuthToken = action({
	args: {
		guestStayCookie: v.string()
	},
	returns: mintGuestConvexAuthTokenResult,
	handler: async (ctx, args) => {
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

		return { token };
	}
});
