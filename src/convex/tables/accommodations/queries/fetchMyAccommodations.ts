// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

/**
 * Owner-scoped paginated list of accommodations. Cursor pagination — stays O(per page)
 * as the portfolio grows. Partnership counts live in {@link fetchMyAccommodationsSummary}
 * for the header, not on each row.
 */
export const fetchMyAccommodations = fetchOptimized({
	table: 'accommodations',
	auth: 'user',
	where: async (ctx) => {
		const ownerId = await getAuthUserId(ctx);
		if (!ownerId) return null;
		return { index: 'by_owner', eq: { ownerId } };
	}
});
