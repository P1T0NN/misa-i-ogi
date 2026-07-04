// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

/**
 * One-off backfill for `partnerships.createType`, needed by the trial-expiry
 * cron (it only deactivates `custom` rows). Pre-existing rows can't be
 * attributed perfectly, so we use the best available proxy: a partnership whose
 * hospitality is user-created (`hospitalities.createType === 'user'`) must have
 * come from the self-service flow → `custom`. Everything else stays unset
 * (= `platform` by convention).
 *
 * Limitation: legacy self-service links to ADMIN-created venues are
 * indistinguishable from admin-created links and stay `platform` — audit those
 * by hand if any predate this migration. Idempotent.
 *
 * Run: bunx convex run migrations/backfillPartnershipCreateTypeInternal:backfillPartnershipCreateType
 */
export const backfillPartnershipCreateType = internalMutation({
	args: {},
	handler: async (ctx) => {
		const partnerships = await ctx.db.query('partnerships').collect();

		let patched = 0;
		for (const partnership of partnerships) {
			if (partnership.createType !== undefined) continue;

			const hospitality = await ctx.db.get(partnership.hospitalityId);
			if (!hospitality || (hospitality.createType ?? 'platform') !== 'user') continue;

			await ctx.db.patch(partnership._id, { createType: 'custom' });
			patched++;
		}

		return { total: partnerships.length, patched };
	}
});
