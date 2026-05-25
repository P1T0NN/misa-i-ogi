import { query } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';
import { getAccommodationPartnershipsByAccommodationIdSafe } from '@/convex/tables/partnerships/helpers/getAccommodationPartnerships';

// TYPES
import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

/** Guest-stay perks list, scoped by Convex guest auth. */
export const fetchAccommodationPartnerships = query({
	args: {},
	handler: async (ctx): Promise<AccommodationPartnershipSafe[]> => {
		const guest = await getActiveGuestSessionFromAuth(ctx);
		if (!guest) return [];

		return getAccommodationPartnershipsByAccommodationIdSafe(ctx, guest.accommodationId);
	}
});
