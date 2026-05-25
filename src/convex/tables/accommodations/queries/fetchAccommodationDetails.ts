import { query } from '@/convex/_generated/server';

// HELPERS
import { getAccommodationByIdSafe } from '@/convex/tables/accommodations/helpers/getAccommodationByIdSafe';
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';

// TYPES
import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';

/** Guest-stay accommodation details, scoped by Convex guest auth. */
export const fetchAccommodationDetails = query({
	args: {},
	handler: async (ctx): Promise<AccommodationStayDetailsSafe | null> => {
		const guest = await getActiveGuestSessionFromAuth(ctx);
		if (!guest) return null;

		return getAccommodationByIdSafe(ctx, guest.accommodationId);
	}
});
