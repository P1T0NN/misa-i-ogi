// CONFIG
import { FEATURES } from '@/shared/config';

// TYPES
import type { MutationCtx } from '../_generated/server';
import type { Id } from '../_generated/dataModel';

export type ResolvedImage = { key: string; url: string };

/**
 * Resolves the ordered upload refs a MutationForm submits (R2 keys or
 * `uploadedFiles` row ids, per FEATURES.USE_R2) into `{ key, url }` pairs by
 * reading the cached `url` off the matching upload row. Embed the result on the
 * domain document — order is preserved, so `images[0]` stays the cover image and
 * reads never touch storage.
 *
 * Refs whose upload row has vanished (deleted between upload and submit) — or,
 * when `ownerId` is given, whose upload isn't owned by that user — are silently
 * dropped rather than failing the whole write. Pass `ownerId` on self-service
 * writes so a caller can't embed someone else's uploads.
 */
export async function resolveUploadedImages(
	ctx: MutationCtx,
	refs: string[],
	ownerId?: string
): Promise<ResolvedImage[]> {
	const resolved = await Promise.all(
		refs.map(async (ref) => {
			const row = FEATURES.USE_R2
				? await ctx.db
						.query('uploadedFilesR2')
						.withIndex('by_key', (q) => q.eq('key', ref))
						.unique()
				: await ctx.db.get(ref as Id<'uploadedFilesR2'>);
			if (!row) return null;
			if (ownerId !== undefined && row.ownerId !== ownerId) return null;
			return { key: ref, url: row.url };
		})
	);
	return resolved.filter((r) => r !== null);
}
