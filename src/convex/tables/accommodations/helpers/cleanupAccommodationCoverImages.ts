// LIBRARIES
import { r2 } from '@/convex/storage/r2/r2';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc } from '@/convex/_generated/dataModel';

export async function cleanupAccommodationCoverImages(
	ctx: MutationCtx,
	docs: Doc<'accommodations'>[]
): Promise<void> {
	const keys = [...new Set(docs.map((d) => d.coverImageKey).filter((k): k is string => !!k))];
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
}
