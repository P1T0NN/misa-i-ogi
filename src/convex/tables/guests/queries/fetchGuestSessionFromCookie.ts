// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSession } from '@/convex/tables/guests/helpers/getActiveGuestSession';

// UTILS
import { verifyGuestSessionCookie } from '@/convex/tables/guests/utils/guestStayCookieCrypto';

// TYPES
import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';

/** Server-side bridge from the HttpOnly guest cookie to a short-lived Convex guest JWT. */
export const fetchGuestSessionFromCookie = query({
	args: {
		guestStayCookie: v.string()
	},
	handler: async (ctx, args): Promise<CurrentGuest> => {
		const payload = await verifyGuestSessionCookie(args.guestStayCookie);
		if (!payload) {
			return { status: 'missing', guest: null };
		}

		if (payload.exp < Date.now()) {
			return { status: 'expired', guest: null };
		}

		const guest = await getActiveGuestSession(ctx, args.guestStayCookie);
		if (!guest) {
			return { status: 'expired', guest: null };
		}

		return {
			status: 'active',
			guest: {
				_id: guest._id,
				accommodationId: guest.accommodationId,
				expiresAt: guest.expiresAt,
				createdAt: guest.createdAt,
				lastSeenAt: guest.lastSeenAt
			}
		};
	}
});
