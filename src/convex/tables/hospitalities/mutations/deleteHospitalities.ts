// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';

// R2
import { r2 } from '@/convex/storage/r2/r2';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc } from '@/convex/_generated/dataModel';

/**
 * Admin-only bulk delete for hospitalities. See `deleteAccommodations` for the
 * full rationale behind the Phase-1 cover-image cleanup and the atomicity
 * invariant — same shape, different table.
 */
const cleanupCoverImages = async (
	ctx: MutationCtx,
	docs: Doc<'hospitalities'>[]
) => {
	const keys = [
		...new Set(docs.map((d) => d.coverImageKey).filter((k): k is string => !!k))
	];
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

export const deleteHospitalities = createDeleteMutation('deleteHospitalities', {
	table: 'hospitalities',
	runStorageDelete: cleanupCoverImages,
	phase2Strategy: 'optimized'
});
