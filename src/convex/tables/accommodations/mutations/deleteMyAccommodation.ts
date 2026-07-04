// LIBRARIES
import { ConvexError } from 'convex/values';

// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';
import { cleanupAccommodationCoverImages } from '@/convex/tables/accommodations/helpers/cleanupAccommodationCoverImages';
import { accommodationHasActiveGuest } from '@/convex/tables/guests/helpers/accommodationHasActiveGuest';
import { hasActiveAccommodationPartnership } from '@/convex/tables/partnerships/helpers/hasActivePartnership';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';

/** Owner self-service delete — same guards and storage cleanup as admin bulk delete. */
export const deleteMyAccommodation = createDeleteMutation('deleteMyAccommodation', {
	table: 'accommodations',
	ownerId: { field: (doc) => doc.ownerId },
	runStorageDelete: cleanupAccommodationCoverImages,
	phase2Strategy: 'optimized',
	authorize: async (ctx, doc) => {
		if (await accommodationHasActiveGuest(ctx, doc._id)) {
			throw new ConvexError({
				code: 'ACCOMMODATION_HAS_ACTIVE_GUEST',
				message: { key: 'GenericMessages.ACCOMMODATION_CANNOT_DELETE_ACTIVE_GUEST' }
			} satisfies ConvexErrorPayload);
		}
		if (await hasActiveAccommodationPartnership(ctx, doc._id)) {
			throw new ConvexError({
				code: 'ACCOMMODATION_HAS_ACTIVE_PARTNERSHIP',
				message: { key: 'GenericMessages.ACCOMMODATION_CANNOT_DELETE_ACTIVE_PARTNERSHIP' }
			} satisfies ConvexErrorPayload);
		}
		return true;
	}
});
