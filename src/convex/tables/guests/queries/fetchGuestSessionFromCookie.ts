// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { assertTrustedServer } from '@/convex/auth/assertTrustedServer';
import { resolveGuestSessionFromCookie } from '@/convex/tables/guests/helpers/resolveGuestSessionFromCookie';

// VALIDATORS
import { currentGuestValidator } from '@/convex/tables/guests/validators/guestQueryValidators';

/**
 * SvelteKit-only bridge from the HttpOnly guest cookie to a guest session row.
 * Requires the shared server secret — not callable from the browser.
 */
export const fetchGuestSessionFromCookie = query({
	args: {
		guestStayCookie: v.string(),
		trustedServerSecret: v.string(),
		asOfMs: v.number()
	},
	returns: currentGuestValidator,
	handler: async (ctx, args) => {
		assertTrustedServer(args.trustedServerSecret);
		return resolveGuestSessionFromCookie(ctx, args.guestStayCookie, args.asOfMs);
	}
});
