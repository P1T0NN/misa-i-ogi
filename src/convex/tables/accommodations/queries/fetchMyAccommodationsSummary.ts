// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// UTILS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { MyAccommodationsSummary } from '@/convex/tables/accommodations/types/accommodationsTypes';

// VALIDATORS
import { myAccommodationsSummaryValidator } from '@/convex/tables/accommodations/validators/accommodationQueryValidators';

/** Portfolio-wide counts for the owner header — independent of paginated list pages. */
export const fetchMyAccommodationsSummary = query({
	args: {},
	returns: myAccommodationsSummaryValidator,
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

		const partnershipCounts = await Promise.all(
			accommodations.map((accommodation) =>
				ctx.db
					.query('partnerships')
					.withIndex('by_accommodation_active', (q) =>
						q.eq('accommodationId', accommodation._id).eq('isActive', true)
					)
					.collect()
					.then((partnerships) => partnerships.length)
			)
		);
		const activePartnershipsCount = partnershipCounts.reduce((sum, count) => sum + count, 0);

		return {
			totalCount: accommodations.length,
			activeCount: accommodations.filter((accommodation) => accommodation.isActive).length,
			activePartnershipsCount
		};
	}
});
