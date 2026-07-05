// R2
import { r2 } from '@/convex/storage/r2/r2';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';

/**
 * Delete R2 objects AND their `uploadedFilesR2` rows for the given keys.
 * Nullish/empty keys are skipped, duplicates collapsed. Rows and objects must go
 * together — the orphan cron only reconciles R2 ↔ uploadedFilesR2 and cannot know
 * that a table reference (coverImageKey / menuFileKey) disappeared.
 *
 * Transactional like everything else in a mutation: `r2.deleteObject` schedules the
 * network DELETE behind commit, so a later throw rolls back both sides.
 */
export async function deleteUploadedFilesByKeys(
	ctx: MutationCtx,
	keys: Array<string | null | undefined>
): Promise<void> {
	const unique = [...new Set(keys.filter((k): k is string => !!k))];
	await Promise.all(
		unique.map(async (key) => {
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
