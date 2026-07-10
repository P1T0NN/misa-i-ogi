// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

// TYPES
import type { ResolvedImage } from '@/convex/helpers/resolveUploadedImages';

/**
 * One-off move: legacy `coverImageKey`/`coverImageUrl` → the ordered `images`
 * array (`images[0]` is the cover). Sets `images` from the existing cover and
 * unsets the two legacy columns so the schema can drop them afterwards.
 * Idempotent: rows that already have `images` (or never had a cover) are skipped.
 *
 * Run BEFORE deploying the schema change that removes the cover columns:
 * bunx convex run migrations/backfillHospitalityImagesInternal:backfillHospitalityImages
 */
export const backfillHospitalityImages = internalMutation({
	args: {},
	handler: async (ctx) => {
		const hospitalities = await ctx.db.query('hospitalities').collect();

		let patched = 0;
		for (const hospitality of hospitalities) {
			if (hospitality.images !== undefined) continue;

			// `coverImageKey`/`coverImageUrl` are intentionally gone from the schema type —
			// read them off the raw legacy row.
			const legacy = hospitality as unknown as { coverImageKey?: string; coverImageUrl?: string };
			const images =
				legacy.coverImageKey && legacy.coverImageUrl
					? [{ key: legacy.coverImageKey, url: legacy.coverImageUrl }]
					: [];

			// Cast: the legacy cover columns are gone from the schema type, but we still
			// pass `undefined` at runtime to unset them on old rows.
			await ctx.db.patch(hospitality._id, {
				images,
				coverImageKey: undefined,
				coverImageUrl: undefined
			} as { images: ResolvedImage[] });
			patched++;
		}

		return { total: hospitalities.length, patched };
	}
});
