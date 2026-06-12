// LIBRARIES
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { query, type QueryCtx } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getUserAnalyticsChartData } from '../helpers/getUserAnalyticsChartData';
import { getAccommodationsByIds } from '@/convex/tables/accommodations/helpers/getAccommodationsByIds';
import { getHospitalitiesByIds } from '@/convex/tables/hospitalities/helpers/getHospitalitiesByIds';

// CONFIG
import { ANALYTICS_RANKING_LIMIT } from '@/convex/analytics/analyticsConstants';

// UTILS
import { buildTopAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';

// TYPES
import type { UserAnalyticsOverviewPageResult } from '../types/userAnalyticsTypes';

async function _buildOverviewTopAccommodations(ctx: QueryCtx, userId: string) {
	const ownerScopeId = createAnalyticsScopeId('accommodationOwner', userId);

	return buildTopAnalyticsRows({
		entity: 'accommodation',
		ctx,
		scope: { type: 'organization', id: ownerScopeId },
		dimensionKey: 'accommodationId',
		limit: ANALYTICS_RANKING_LIMIT,
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
		entity: 'hospitality',
		ctx,
		scope: { type: 'organization', id: ownerScopeId },
		dimensionKey: 'hospitalityId',
		limit: ANALYTICS_RANKING_LIMIT,
		getItemsByIds: getHospitalitiesByIds,
		candidateMetrics: ['hospitalityViews', 'newReservations'],
		scoreMetric: 'hospitalityViews',
		primaryMetric: 'hospitalityViews',
		requestMetric: 'newReservations',
		confirmedMetric: 'confirmedReservations',
		tieBreakerMetrics: ['newReservations']
	});
}

/**
 * Single overview payload for the analytics dashboard landing page.
 */
export const fetchUserAnalyticsOverviewPage = query({
	args: {},
	handler: async (ctx): Promise<UserAnalyticsOverviewPageResult> => {
		const userId = await requireAuthUserId(ctx);

		const [
			qrScansChart,
			guestActivationsChart,
			reservationsChart,
			topAccommodations,
			topHospitalities
		] = await Promise.all([
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
