// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { enrichPartnershipRequestItems } from '@/convex/tables/partnershipRequests/helpers/enrichPartnershipRequestItems';

/** Paginated list of partnership requests sent by the signed-in accommodation owner. */
export const fetchPartnershipsRequestsSent = fetchOptimized({
	table: 'partnershipRequests',
	auth: 'user',
	strategy: 'cursor',
	order: 'desc',
	where: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return null;

		return {
			index: 'by_accommodation_owner_status' as const,
			eq: { accommodationOwnerId: userId }
		};
	},
	enrich: (ctx, page) => enrichPartnershipRequestItems(ctx, page)
});
