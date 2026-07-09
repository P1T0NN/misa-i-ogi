// LIBRARIES
import { v } from 'convex/values';
import { internalQuery } from '@/convex/_generated/server';

// HELPERS
import { resolveGuestSessionFromCookie } from '@/convex/tables/guests/helpers/resolveGuestSessionFromCookie';

// VALIDATORS
import { currentGuestValidator } from '@/convex/tables/guests/validators/guestQueryValidators';

/** Convex-internal cookie → guest session (actions and trusted server routes). */
export const fetchGuestSessionFromCookieInternal = internalQuery({
	args: {
		guestStayCookie: v.string(),
		asOfMs: v.number()
	},
	returns: currentGuestValidator,
	handler: async (ctx, args) =>
		resolveGuestSessionFromCookie(ctx, args.guestStayCookie, args.asOfMs)
});
