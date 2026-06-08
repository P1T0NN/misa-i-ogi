// LIBRARIES
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { query, type QueryCtx } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getUserAnalyticsChartData } from '../helpers/getUserAnalyticsChartData';
import { getAccommodationsByIds } from '@/convex/tables/accommodations/helpers/getAccommodationsByIds';
import { getHospitalitiesByIds } from '@/convex/tables/hospitalities/helpers/getHospitalitiesByIds';

// UTILS
import { buildTopAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';

// TYPES
import type { UserAnalyticsOverviewPageResult } from '../types/userAnalyticsTypes';

const OVERVIEW_RANKING_LIMIT = 5;

async function _buildOverviewTopAccommodations(ctx: QueryCtx, userId: string) {
	const ownerScopeId = createAnalyticsScopeId('accommodationOwner', userId);

	return buildTopAnalyticsRows({
		ctx,
		scope: { type: 'organization', id: ownerScopeId },
		dimensionKey: 'accommodationId',
		limit: OVERVIEW_RANKING_LIMIT,
		getItemsByIds: getAccommodationsByIds,
		candidateMetrics: ['qrScans', 'guestActivations', 'newReservations'],
		scoreMetric: 'qrScans',
		primaryMetric: 'qrScans',
		secondaryMetric: 'guestActivations',
		requestMetric: 'newReservations',
		confirmedMetric: 'confirmedReservations',
		tieBreakerMetrics: ['newReservations']
	});
}

async function _buildOverviewTopHospitalities(ctx: QueryCtx, userId: string) {
	const ownerScopeId = createAnalyticsScopeId('hospitalityOwner', userId);

	return buildTopAnalyticsRows({
		ctx,
		scope: { type: 'organization', id: ownerScopeId },
		dimensionKey: 'hospitalityId',
		limit: OVERVIEW_RANKING_LIMIT,
		getItemsByIds: getHospitalitiesByIds,
		candidateMetrics: ['newReservations', 'activePartnerships'],
		scoreMetric: 'newReservations',
		primaryMetric: 'activePartnerships',
		requestMetric: 'newReservations',
		confirmedMetric: 'confirmedReservations',
		tieBreakerMetrics: ['activePartnerships']
	});
}

/**
 * Single overview payload for the analytics dashboard landing page.
 *
 * We intentionally bundle every overview widget (3 trend charts + 2 ranking tables)
 * into one query instead of five separate `useQuery` subscriptions because:
 * - Convex charges/re-runs per subscribed query; one subscription scales better as
 *   concurrent owners grow (fewer websocket watchers per user on this page).
 * - All widgets share the same auth scope and 30-day window, so parallel fetches
 *   inside one handler avoid duplicated setup work across five handlers.
 * - The page can show one loading/error state and pass props to presentational
 *   widgets, matching the pattern used on accommodations/hospitalities list pages.
 *
 * Portfolio empty-state gating still lives in the client (`authClass` flags) so we
 * do not run this query when the user owns neither accommodations nor hospitalities.
 */
export const fetchUserAnalyticsOverviewPage = query({
	args: {},
	handler: async (ctx): Promise<UserAnalyticsOverviewPageResult> => {
		const userId = await requireAuthUserId(ctx);

		const [qrScansChart, guestActivationsChart, reservationsChart, topAccommodations, topHospitalities] =
			await Promise.all([
				getUserAnalyticsChartData(ctx, 'qrScans', userId),
				getUserAnalyticsChartData(ctx, 'guestActivations', userId),
				getUserAnalyticsChartData(ctx, 'newReservations', userId),
				_buildOverviewTopAccommodations(ctx, userId),
				_buildOverviewTopHospitalities(ctx, userId)
			]);

		return {
			qrScansChart,
			guestActivationsChart,
			reservationsChart,
			topAccommodations,
			topHospitalities
		};
	}
});