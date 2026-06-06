// LIBRARIES
import { createAnalyticsScopeId, getAnalyticsRanking } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getAccommodationsByIds } from '@/convex/tables/accommodations/helpers/getAccommodationsByIds';
import { uniqueIds } from '@/convex/helpers/uniqueIds';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { UserAnalyticsRankingRow } from '../types/userAnalyticsTypes';

const RANKING_LIMIT = 5;

export const fetchUserAnalyticsTopAccommodations = query({
	args: {},
	handler: async (ctx): Promise<UserAnalyticsRankingRow[]> => {
		const userId = await requireAuthUserId(ctx);
		const ownerScopeId = createAnalyticsScopeId('accommodationOwner', userId);

		const [qrScanTotals, guestActivationTotals, reservationTotals, confirmedTotals] =
			await Promise.all([
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'qrScans',
					scope: { type: 'organization', id: ownerScopeId },
					dimensionKey: 'accommodationId'
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'guestActivations',
					scope: { type: 'organization', id: ownerScopeId },
					dimensionKey: 'accommodationId'
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'newReservations',
					scope: { type: 'organization', id: ownerScopeId },
					dimensionKey: 'accommodationId'
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'confirmedReservations',
					scope: { type: 'organization', id: ownerScopeId },
					dimensionKey: 'accommodationId'
				})
			]);

		const rankingIds = uniqueIds([
			...qrScanTotals.keys(),
			...guestActivationTotals.keys(),
			...reservationTotals.keys()
		]);

		const topAccommodationIds = getAnalyticsRanking({
			items: rankingIds,
			getScore: (id) => qrScanTotals.get(id) ?? 0,
			tieBreakers: [(a, b) => (reservationTotals.get(b) ?? 0) - (reservationTotals.get(a) ?? 0)],
			limit: RANKING_LIMIT
		}) as Id<'accommodations'>[];

		if (topAccommodationIds.length === 0) return [];

		const accommodations = await getAccommodationsByIds(ctx, topAccommodationIds);

		const accommodationById = new Map(
			accommodations.map((accommodation) => [accommodation._id, accommodation])
		);

		return topAccommodationIds.flatMap((accommodationId) => {
			const accommodation = accommodationById.get(accommodationId);
			if (!accommodation) return [];

			const requests = reservationTotals.get(accommodationId) ?? 0;
			const confirmed = confirmedTotals.get(accommodationId) ?? 0;

			return {
				id: accommodation._id,
				name: accommodation.name,
				type: accommodation.type,
				city: accommodation.city,
				isActive: accommodation.isActive,
				primaryMetricValue: qrScanTotals.get(accommodation._id) ?? 0,
				secondaryMetricValue: guestActivationTotals.get(accommodation._id) ?? 0,
				requests,
				confirmed
			};
		});
	}
});
