// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

/**
 * One-off cleanup: the `visibility` field is being removed from the `hospitalities`
 * schema (dormant — read by no query). Existing rows still carry it, which fails
 * Convex schema validation on push until stripped. Patching `visibility: undefined`
 * unsets the field. Idempotent — rows without the field are skipped.
 *
 * Run BEFORE deploying the schema change (or `schemaValidation` will reject it):
 * bunx convex run migrations/dropHospitalityVisibilityInternal:dropHospitalityVisibility
 */
export const dropHospitalityVisibility = internalMutation({
	args: {},
	handler: async (ctx) => {
		const hospitalities = await ctx.db.query('hospitalities').collect();

		let patched = 0;
		for (const hospitality of hospitalities) {
			if ((hospitality as Record<string, unknown>).visibility === undefined) continue;
			// @ts-expect-error `visibility` is intentionally gone from the schema; unset it on legacy rows.
			await ctx.db.patch(hospitality._id, { visibility: undefined });
			patched++;
		}

		return { total: hospitalities.length, patched };
	}
});
