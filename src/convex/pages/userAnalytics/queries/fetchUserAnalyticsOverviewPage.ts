// LIBRARIES
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { analytics } from '@/convex/analytics';
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
import { toComparedMetric } from '@/convex/analytics/utils/comparedMetricUtils';
import { createAnalyticsQueryDayRange } from '@/convex/analytics/utils/analyticsQueryRange';

// TYPES
import type {
	UserAnalyticsChartPoint,
	UserAnalyticsOverviewPageResult,
	UserAnalyticsOverviewTrendPoint
} from '../types/userAnalyticsTypes';

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

/** Merge the three single-metric daily series into one trend series keyed by date. */
function _buildOverviewTrend(
	qrScans: UserAnalyticsChartPoint[],
	guestActivations: UserAnalyticsChartPoint[],
	reservations: UserAnalyticsChartPoint[]
): UserAnalyticsOverviewTrendPoint[] {
	const byDate = new Map<number, UserAnalyticsOverviewTrendPoint>();

	const ensure = (date: number) => {
		let point = byDate.get(date);
		if (!point) {
			point = { date, qrScans: 0, guestActivations: 0, reservations: 0 };
			byDate.set(date, point);
		}
		return point;
	};

	for (const p of qrScans) ensure(p.date).qrScans = p.value;
	for (const p of guestActivations) ensure(p.date).guestActivations = p.value;
	for (const p of reservations) ensure(p.date).reservations = p.value;

	return [...byDate.values()].sort((first, second) => first.date - second.date);
}

/**
 * Single overview payload for the analytics dashboard landing page.
 */
export const fetchUserAnalyticsOverviewPage = query({
	args: {},
	handler: async (ctx): Promise<UserAnalyticsOverviewPageResult> => {
		const userId = await requireAuthUserId(ctx);
		const { from, to: todayStart } = createAnalyticsQueryDayRange();

		const [
			dashboard,
			qrScansChart,
			guestActivationsChart,
			reservationsChart,
			topAccommodations,
			topHospitalities
		] = await Promise.all([
			// Union scope (raw userId) spans both accommodation- and hospitality-owner events.
			analytics.fetchDashboardMetrics(ctx, {
				metrics: ['qrScans', 'guestActivations', 'newReservations', 'confirmedReservations'],
				scope: { type: 'organization', id: userId },
				from,
				to: todayStart,
				includeComparison: true,
				includeEvaluation: true
			}),
			getUserAnalyticsChartData(ctx, 'qrScans', userId),
			getUserAnalyticsChartData(ctx, 'guestActivations', userId),
			getUserAnalyticsChartData(ctx, 'newReservations', userId),
			_buildOverviewTopAccommodations(ctx, userId),
			_buildOverviewTopHospitalities(ctx, userId)
		]);

		return {
			metrics: {
				qrScans: toComparedMetric(dashboard.metrics.qrScans),
				guestActivations: toComparedMetric(dashboard.metrics.guestActivations),
				requestsGenerated: toComparedMetric(dashboard.metrics.newReservations),
				confirmedReservations: toComparedMetric(dashboard.metrics.confirmedReservations)
			},
			trendChart: _buildOverviewTrend(qrScansChart, guestActivationsChart, reservationsChart),
			topAccommodations,
			topHospitalities
		};
	}
});
