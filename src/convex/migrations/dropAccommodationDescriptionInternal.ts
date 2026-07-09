// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

/**
 * One-off cleanup: the `description` field was removed from the `accommodations`
 * schema. Existing rows still carry it, which fails Convex schema validation on
 * push until stripped. Patching `description: undefined` unsets the field.
 * Idempotent — rows without the field are skipped.
 *
 * Run BEFORE deploying the schema change (or `schemaValidation` will reject it):
 * bunx convex run migrations/dropAccommodationDescriptionInternal:dropAccommodationDescription
 */
export const dropAccommodationDescription = internalMutation({
	args: {},
	handler: async (ctx) => {
		// Cast: `description` is already gone from the generated type, so read the raw row.
		const accommodations = await ctx.db.query('accommodations').collect();

		let patched = 0;
		for (const accommodation of accommodations) {
			if ((accommodation as Record<string, unknown>).description === undefined) continue;
			// @ts-expect-error `description` is intentionally gone from the schema; unset it on legacy rows.
			await ctx.db.patch(accommodation._id, { description: undefined });
			patched++;
		}

		return { total: accommodations.length, patched };
	}
});
