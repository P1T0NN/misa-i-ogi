// LIBRARIES
import { ConvexError } from 'convex/values';

// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';
import { accommodationHasActiveGuest } from '@/convex/tables/guests/helpers/accommodationHasActiveGuest';

// R2
import { r2 } from '@/convex/storage/r2/r2';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc } from '@/convex/_generated/dataModel';
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
const cleanupCoverImages = async (
	ctx: MutationCtx,
	docs: Doc<'accommodations'>[]
) => {
	const keys = [
		...new Set(docs.map((d) => d.coverImageKey).filter((k): k is string => !!k))
	];
	// Keys are independent — parallel sweep collapses N×3 serial round-trips into
	// one. Atomicity is unchanged: same transaction, same commit boundary.
	await Promise.all(
		keys.map(async (key) => {
			const [row] = await Promise.all([
				ctx.db
					.query('uploadedFilesR2')
					.withIndex('by_key', (q) => q.eq('key', key))
					.unique(),
				r2.deleteObject(ctx, key)
			]);
			if (row) await ctx.db.delete(row._id);
		})
	);
};

export const deleteAccommodations = createDeleteMutation('deleteAccommodations', {
	table: 'accommodations',
	runStorageDelete: cleanupCoverImages,
	// Safe here: no `onDelete` hook means Phase 2 has no cross-row writes that
	// could race. Audit inserts go to a separate table and are independent.
	phase2Strategy: 'optimized',
	authorize: async (ctx, doc) => {
		if (await accommodationHasActiveGuest(ctx, doc._id)) {
			throw new ConvexError({
				code: 'ACCOMMODATION_HAS_ACTIVE_GUEST',
				message: { key: 'GenericMessages.ACCOMMODATION_CANNOT_DELETE_ACTIVE_GUEST' }
			} satisfies ConvexErrorPayload);
		}
		return true;
	}
});
