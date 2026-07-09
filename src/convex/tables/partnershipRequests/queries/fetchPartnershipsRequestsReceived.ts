// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { enrichPartnershipRequestItems } from '@/convex/tables/partnershipRequests/helpers/enrichPartnershipRequestItems';

/** Paginated list of pending partnership requests received by the signed-in hospitality owner. */
export const fetchPartnershipsRequestsReceived = fetchOptimized({
	table: 'partnershipRequests',
	auth: 'user',
	strategy: 'cursor',
	order: 'desc',
	where: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return null;

		return {
			index: 'by_hospitality_owner_status' as const,
			eq: { hospitalityOwnerId: userId, status: 'pending' as const }
		};
	},
	enrich: (ctx, page) => enrichPartnershipRequestItems(ctx, page)
});
