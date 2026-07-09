// LIBRARIES
import { ConvexError } from 'convex/values';

// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { cascadeAccommodationChildren } from '@/convex/tables/accommodations/helpers/cascadeAccommodationChildren';
import { cleanupAccommodationCoverImages } from '@/convex/tables/accommodations/helpers/cleanupAccommodationCoverImages';
import { accommodationHasActiveGuest } from '@/convex/tables/guests/helpers/accommodationHasActiveGuest';
import { hasActiveAccommodationPartnership } from '@/convex/tables/partnerships/helpers/hasActivePartnership';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';

/** Owner self-service delete — same guards and storage cleanup as admin bulk delete. */
export const deleteMyAccommodation = createDeleteMutation('deleteMyAccommodation', {
	table: 'accommodations',
	totalCounterKey: COUNTER_KEYS.ACCOMMODATIONS_TOTAL,
	ownerId: { field: (doc) => doc.ownerId },
	runStorageDelete: cleanupAccommodationCoverImages,
	// Sequential + cascade: see `deleteAccommodations` for the rationale.
	phase2Strategy: 'sequential',
	onDelete: (ctx, doc) => cascadeAccommodationChildren(ctx, doc._id),
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
