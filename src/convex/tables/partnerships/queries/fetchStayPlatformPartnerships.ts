// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';

/**
 * Guest-stay platform perks — cursor-paginated active platform venues.
 *
 * Union mode with zero specs is the factory's "deny" primitive: no guest session means
 * an empty page, never a full-table walk. (`where: null` would walk the table.)
 */
export const fetchStayPlatformPartnerships = fetchOptimized({
	table: 'hospitalities',
	strategy: 'cursor',
	order: 'asc',
	union: async (ctx) => {
		const guest = await getActiveGuestSessionFromAuth(ctx);
		if (!guest) return { specs: [] };

		return {
			specs: [
				{
					index: 'by_create_type_active' as const,
					eq: { createType: 'platform' as const, isActive: true }
				}
			]
		};
	}
});
