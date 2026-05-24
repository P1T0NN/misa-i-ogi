// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// UTILS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { MyAccommodationsSummary } from '@/convex/tables/accommodations/types/accommodationsTypes';

/** Portfolio-wide counts for the owner header — independent of paginated list pages. */
export const fetchMyAccommodationsSummary = query({
	args: {},
	handler: async (ctx): Promise<MyAccommodationsSummary> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const accommodations = await ctx.db
			.query('accommodations')
			.withIndex('by_owner', (q) => q.eq('ownerId', userId))
			.collect();

		let activePartnershipsCount = 0;
		for (const accommodation of accommodations) {
			const partnerships = await ctx.db
				.query('partnerships')
				.withIndex('by_accommodation', (q) => q.eq('accommodationId', accommodation._id))
				.collect();
			activePartnershipsCount += partnerships.filter((partnership) => partnership.isActive).length;
		}

		return {
			totalCount: accommodations.length,
			activeCount: accommodations.filter((accommodation) => accommodation.isActive).length,
			activePartnershipsCount
		};
	}
});
