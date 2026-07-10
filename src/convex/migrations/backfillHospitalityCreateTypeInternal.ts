// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

/**
 * One-off backfill for `hospitalities.createType` — every pre-existing row was
 * admin-created, so it becomes `createType: "platform"` (the
 * `by_create_type_active` index only matches rows where the field is actually
 * set). Idempotent: rows that already carry it are skipped.
 *
 * Run: bunx convex run migrations/backfillHospitalityCreateTypeInternal:backfillHospitalityCreateType
 */
export const backfillHospitalityCreateType = internalMutation({
	args: {},
	handler: async (ctx) => {
		const hospitalities = await ctx.db.query('hospitalities').collect();

		let patched = 0;
		for (const hospitality of hospitalities) {
			if (hospitality.createType !== undefined) continue;
			await ctx.db.patch(hospitality._id, {
				createType: hospitality.createType ?? 'platform'
			});
			patched++;
		}

		return { total: hospitalities.length, patched };
	}
});
