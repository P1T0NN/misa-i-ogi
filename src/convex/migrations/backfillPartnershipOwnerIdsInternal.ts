// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

/**
 * One-off backfill for `partnerships.accommodationOwnerId` / `hospitalityOwnerId`, the
 * denormalized keys `fetchActivePartnershipsSafe` indexes on. Until a row has them it
 * matches neither union spec and stays invisible to its owner, so run this right after
 * deploying the schema change. Idempotent.
 *
 * Run: bunx convex run migrations/backfillPartnershipOwnerIdsInternal:backfillPartnershipOwnerIds
 */
export const backfillPartnershipOwnerIds = internalMutation({
	args: {},
	handler: async (ctx) => {
		const partnerships = await ctx.db.query('partnerships').collect();

		let patched = 0;
		for (const partnership of partnerships) {
			if (
				partnership.accommodationOwnerId !== undefined &&
				partnership.hospitalityOwnerId !== undefined
			) {
				continue;
			}

			const [accommodation, hospitality] = await Promise.all([
				ctx.db.get(partnership.accommodationId),
				ctx.db.get(partnership.hospitalityId)
			]);
			if (!accommodation || !hospitality) continue;

			await ctx.db.patch(partnership._id, {
				accommodationOwnerId: accommodation.ownerId,
				hospitalityOwnerId: hospitality.ownerId
			});
			patched++;
		}

		return { total: partnerships.length, patched };
	}
});
