// LIBRARIES
import { query } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';

// VALIDATORS
import {
	currentGuestValidator,
	guestSessionSafe
} from '@/convex/tables/guests/validators/guestQueryValidators';

// TYPES
import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';

/** Resolves the current guest session from Convex guest auth context. */
export const fetchCurrentGuest = query({
	args: {},
	returns: currentGuestValidator,
	handler: async (ctx): Promise<CurrentGuest> => {
		const guest = await getActiveGuestSessionFromAuth(ctx);
		if (!guest) {
			return { status: 'missing', guest: null };
		}

		return {
			status: 'active',
			guest: guestSessionSafe.project(guest)
		};
	}
});
