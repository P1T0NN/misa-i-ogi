// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// UTILS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { MyHospitalitiesSummary } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/** Portfolio-wide counts for the owner header — independent of paginated list pages. */
export const fetchMyHospitalitiesSummary = query({
	args: {},
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

		let activePartnershipsCount = 0;
		for (const hospitality of hospitalities) {
			const partnerships = await ctx.db
				.query('partnerships')
				.withIndex('by_hospitality', (q) => q.eq('hospitalityId', hospitality._id))
				.collect();
			activePartnershipsCount += partnerships.filter((partnership) => partnership.isActive).length;
		}

		return {
			totalCount: hospitalities.length,
			activeCount: hospitalities.filter((hospitality) => hospitality.isActive).length,
			activePartnershipsCount
		};
	}
});
