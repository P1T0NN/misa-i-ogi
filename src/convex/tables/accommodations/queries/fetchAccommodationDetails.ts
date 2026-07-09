// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAccommodationByIdSafe } from '@/convex/tables/accommodations/helpers/getAccommodationByIdSafe';
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';

// VALIDATORS
import { accommodationStaySafe } from '@/convex/tables/accommodations/validators/accommodationQueryValidators';

// TYPES
import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';

/** Guest-stay accommodation details, scoped by Convex guest auth. */
export const fetchAccommodationDetails = query({
	args: {},
	returns: v.union(accommodationStaySafe.validator, v.null()),
	handler: async (ctx): Promise<AccommodationStayDetailsSafe | null> => {
		const guest = await getActiveGuestSessionFromAuth(ctx);
		if (!guest) return null;

		return getAccommodationByIdSafe(ctx, guest.accommodationId);
	}
});
