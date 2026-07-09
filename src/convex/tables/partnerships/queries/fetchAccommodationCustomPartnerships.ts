import { query } from '@/convex/_generated/server';
import { v } from 'convex/values';

// HELPERS
import { getAccommodationByIdSafe } from '@/convex/tables/accommodations/helpers/getAccommodationByIdSafe';
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';
import { getCustomPartnershipsForStaySafe } from '@/convex/tables/partnerships/helpers/getCustomPartnershipsForStaySafe';

// VALIDATORS
import { partnershipAccommodationSafeValidator } from '@/convex/tables/partnerships/validators/partnershipQueryValidators';

// TYPES
import type { PartnershipAccommodationSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

/** Guest-stay custom perks — always loaded in full (bounded per accommodation). */
export const fetchAccommodationCustomPartnerships = query({
	args: {},
	returns: v.array(partnershipAccommodationSafeValidator),
	handler: async (ctx): Promise<PartnershipAccommodationSafe[]> => {
		const guest = await getActiveGuestSessionFromAuth(ctx);
		if (!guest) return [];

		const accommodation = await getAccommodationByIdSafe(ctx, guest.accommodationId);
		if (!accommodation) return [];

		return getCustomPartnershipsForStaySafe(ctx, accommodation._id);
	}
});
