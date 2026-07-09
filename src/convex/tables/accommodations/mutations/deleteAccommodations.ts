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

/**
 * Admin-only bulk delete for accommodations. `createDeleteMutation` defaults to
 * `adminOnly: true` when no `ownerId` is configured, returns the standard
 * `{ success, message }` envelope, and rate-limits via the `delete` bucket.
 *
 * Phase 1 cascade — for every accommodation that carries a cover image we
 * remove both the R2 object and the matching `uploadedFilesR2` row. Skipping
 * this would leak: the orphan-cleanup cron only reconciles R2 ↔ uploadedFilesR2,
 * it has no way to know that an `accommodations.coverImageKey` reference
 * disappeared.
 *
 * Atomicity (the no-ghost-data invariant):
 * Everything below runs inside a single Convex mutation transaction.
 * `r2.deleteObject` from @convex-dev/r2 does NOT issue the S3 DELETE inline —
 * it deletes the component's metadata row and schedules the network DELETE via
 * the retrier workpool. Convex's scheduler is transactional, so a throw
 * anywhere in this mutation rolls back every db write AND every scheduled R2
 * delete. The reverse (R2 gone while a db row points at it) is impossible by
 * construction: the network call is deferred behind commit.
 */
export const deleteAccommodations = createDeleteMutation('deleteAccommodations', {
	table: 'accommodations',
	totalCounterKey: COUNTER_KEYS.ACCOMMODATIONS_TOTAL,
	runStorageDelete: cleanupAccommodationCoverImages,
	// Sequential: the cascade below decrements shared per-owner counters, which
	// would lose updates if two rows ran their `onDelete` in parallel.
	phase2Strategy: 'sequential',
	// Remove the inactive partnership + expired-guest rows that hang off each
	// accommodation (the authorize guard already blocked the ACTIVE ones), keeping
	// PARTNERSHIPS_TOTAL / GUESTS_TOTAL and the per-owner counters in step.
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
