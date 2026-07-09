// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// UTILS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { MyHospitalitiesSummary } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

// VALIDATORS
import { myHospitalitiesSummaryValidator } from '@/convex/tables/hospitalities/validators/hospitalityQueryValidators';

/** Portfolio-wide counts for the owner header — independent of paginated list pages. */
export const fetchMyHospitalitiesSummary = query({
	args: {},
	returns: myHospitalitiesSummaryValidator,
	handler: async (ctx): Promise<MyHospitalitiesSummary> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const hospitalities = await ctx.db
			.query('hospitalities')
			.withIndex('by_owner', (q) => q.eq('ownerId', userId))
			.collect();

		const partnershipCounts = await Promise.all(
			hospitalities.map((hospitality) =>
				ctx.db
					.query('partnerships')
					.withIndex('by_hospitality_active', (q) =>
						q.eq('hospitalityId', hospitality._id).eq('isActive', true)
					)
					.collect()
					.then((partnerships) => partnerships.length)
			)
		);
		const activePartnershipsCount = partnershipCounts.reduce((sum, count) => sum + count, 0);

		return {
			totalCount: hospitalities.length,
			activeCount: hospitalities.filter((hospitality) => hospitality.isActive).length,
			activePartnershipsCount
		};
	}
});
