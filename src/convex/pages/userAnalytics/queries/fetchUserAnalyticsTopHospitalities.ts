// LIBRARIES
import { createAnalyticsScopeId, getAnalyticsRanking } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getHospitalitiesByIds } from '@/convex/tables/hospitalities/helpers/getHospitalitiesByIds';
import { uniqueIds } from '@/convex/helpers/uniqueIds';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { UserAnalyticsRankingRow } from '../types/userAnalyticsTypes';

const RANKING_LIMIT = 5;

export const fetchUserAnalyticsTopHospitalities = query({
	args: {},
	handler: async (ctx): Promise<UserAnalyticsRankingRow[]> => {
		const userId = await requireAuthUserId(ctx);
		const ownerScopeId = createAnalyticsScopeId('hospitalityOwner', userId);

		const [reservationTotals, confirmedTotals, activePartnershipTotals] = await Promise.all([
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'newReservations',
				scope: { type: 'organization', id: ownerScopeId },
				dimensionKey: 'hospitalityId'
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'confirmedReservations',
				scope: { type: 'organization', id: ownerScopeId },
				dimensionKey: 'hospitalityId'
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'activePartnerships',
				scope: { type: 'organization', id: ownerScopeId },
				dimensionKey: 'hospitalityId'
			})
		]);

		const rankingIds = uniqueIds([...reservationTotals.keys(), ...activePartnershipTotals.keys()]);

		const topHospitalityIds = getAnalyticsRanking({
			items: rankingIds,
			getScore: (id) => reservationTotals.get(id) ?? 0,
			tieBreakers: [
				(a, b) => (activePartnershipTotals.get(b) ?? 0) - (activePartnershipTotals.get(a) ?? 0)
			],
			limit: RANKING_LIMIT
		}) as Id<'hospitalities'>[];

		if (topHospitalityIds.length === 0) return [];

		const hospitalities = await getHospitalitiesByIds(ctx, topHospitalityIds);

		const hospitalityById = new Map(
			hospitalities.map((hospitality) => [hospitality._id, hospitality])
		);

		return topHospitalityIds.flatMap((hospitalityId) => {
			const hospitality = hospitalityById.get(hospitalityId);
			if (!hospitality) return [];

			const requests = reservationTotals.get(hospitalityId) ?? 0;
			const confirmed = confirmedTotals.get(hospitalityId) ?? 0;

			return {
				id: hospitality._id,
				name: hospitality.name,
				type: hospitality.type,
				city: hospitality.city,
				isActive: hospitality.isActive,
				primaryMetricValue: activePartnershipTotals.get(hospitality._id) ?? 0,
				requests,
				confirmed
			};
		});
	}
});
