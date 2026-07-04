// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

// HELPERS
import { generateUniqueConnectCode } from '@/convex/tables/hospitalities/helpers/generateUniqueConnectCode';

/**
 * One-off backfill: give every pre-existing hospitality a `connectCode` so the
 * code-based custom-partnership flow can reference it. Idempotent — rows that
 * already have a code are skipped. Codes minted row-by-row stay unique because
 * `generateUniqueConnectCode` sees prior patches within the same mutation.
 *
 * Run: bunx convex run migrations/backfillHospitalityConnectCodeInternal:backfillHospitalityConnectCode
 */
export const backfillHospitalityConnectCode = internalMutation({
	args: {},
	handler: async (ctx) => {
		const hospitalities = await ctx.db.query('hospitalities').collect();

		let patched = 0;
		for (const hospitality of hospitalities) {
			if (hospitality.connectCode !== undefined) continue;
			const connectCode = await generateUniqueConnectCode(ctx);
			await ctx.db.patch(hospitality._id, { connectCode });
			patched++;
		}

		return { total: hospitalities.length, patched };
	}
});
