// LIBRARIES
import { compareScores, createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getUserOwnedHospitalities } from '@/convex/tables/hospitalities/helpers/getUserOwnedHospitalities';

// UTILS
import { getAnalyticsMetricValue } from '@/convex/analytics/utils/getAnalyticsMetricValue';
import {
	emptyMetricComparison,
	toComparedMetric
} from '@/convex/analytics/utils/comparedMetricUtils';
import { ANALYTICS_QUERY_RANGE_DAYS } from '@/convex/analytics/analyticsConstants';
import { createAnalyticsQueryDayRange } from '@/convex/analytics/utils/analyticsQueryRange';

// TYPES
import type {
	UserAnalyticsReservationStatusChartPoint,
	UserAnalyticsReservationSourceRow,
	UserAnalyticsReservationsPageResult
} from '../types/userAnalyticsTypes';
import type { Doc } from '@/convex/_generated/dataModel';

function buildReservationSourceRows(
	hospitalities: Doc<'hospitalities'>[],
	args: {
		createdTotals: Map<string, number>;
		confirmedTotals: Map<string, number>;
		cancelledTotals: Map<string, number>;
	}
): UserAnalyticsReservationSourceRow[] {
	return hospitalities
		.map((hospitality) => ({
			id: hospitality._id,
			name: hospitality.name,
			created: getAnalyticsMetricValue(args.createdTotals, hospitality._id),
			confirmed: getAnalyticsMetricValue(args.confirmedTotals, hospitality._id),
			cancelled: getAnalyticsMetricValue(args.cancelledTotals, hospitality._id)
		}))
		.filter((row) => row.created > 0 || row.confirmed > 0 || row.cancelled > 0)
		.sort(
			(first, second) =>
				compareScores('desc', first.created, second.created) ||
				compareScores('desc', first.confirmed, second.confirmed) ||
				first.name.localeCompare(second.name)
		);
}

function getTimeSeriesValuesByDate(data: Array<Record<string, number>>, metric: string) {
	return new Map(data.map((point) => [point.date, point[metric] ?? 0]));
}

function buildReservationStatusChartData(args: {
	createdSeries: Array<Record<string, number>>;
	confirmedSeries: Array<Record<string, number>>;
	cancelledSeries: Array<Record<string, number>>;
}): UserAnalyticsReservationStatusChartPoint[] {
	const createdByDate = getTimeSeriesValuesByDate(args.createdSeries, 'newReservations');
	const confirmedByDate = getTimeSeriesValuesByDate(args.confirmedSeries, 'confirmedReservations');
	const cancelledByDate = getTimeSeriesValuesByDate(args.cancelledSeries, 'cancelledReservations');
	const dates = [...createdByDate.keys()].sort((first, second) => first - second);

	return dates.map((date) => ({
		date,
		created: createdByDate.get(date) ?? 0,
		confirmed: confirmedByDate.get(date) ?? 0,
		cancelled: cancelledByDate.get(date) ?? 0
	}));
}

export const fetchUserAnalyticsReservationsPage = query({
	args: {},
	handler: async (ctx): Promise<UserAnalyticsReservationsPageResult> => {
		const userId = await requireAuthUserId(ctx);
		const hospitalities = await getUserOwnedHospitalities(ctx, userId);

		if (hospitalities.length === 0) {
			return {
				metrics: {
					created: {
						value: 0,
						comparison: emptyMetricComparison()
					},
					confirmed: {
						value: 0,
						comparison: emptyMetricComparison()
					},
					cancelled: {
						value: 0,
						comparison: emptyMetricComparison()
					}
				},
				statusChart: { data: [] },
				rows: []
			};
		}

		const { from, to: todayStart } = createAnalyticsQueryDayRange();
		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('hospitalityOwner', userId)
		} as const;

		const [
			dashboard,
			createdTotals,
			confirmedTotals,
			cancelledTotals,
			createdSeries,
			confirmedSeries,
			cancelledSeries
		] = await Promise.all([
			analytics.fetchDashboardMetrics(ctx, {
				metrics: ['newReservations', 'confirmedReservations', 'cancelledReservations'],
				scope: ownerScope,
				from,
				to: todayStart,
				includeComparison: true,
				includeEvaluation: true
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'newReservations',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: ANALYTICS_QUERY_RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'confirmedReservations',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: ANALYTICS_QUERY_RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'cancelledReservations',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: ANALYTICS_QUERY_RANGE_DAYS
			}),
			analytics.fetchTimeSeries(ctx, {
				metric: 'newReservations',
				scope: ownerScope,
				from,
				to: todayStart,
				fill: true
			}),
			analytics.fetchTimeSeries(ctx, {
				metric: 'confirmedReservations',
				scope: ownerScope,
				from,
				to: todayStart,
				fill: true
			}),
			analytics.fetchTimeSeries(ctx, {
				metric: 'cancelledReservations',
				scope: ownerScope,
				from,
				to: todayStart,
				fill: true
			})
		]);

		return {
			metrics: {
				created: toComparedMetric(dashboard.metrics.newReservations),
				confirmed: toComparedMetric(dashboard.metrics.confirmedReservations),
				cancelled: toComparedMetric(dashboard.metrics.cancelledReservations)
			},
			statusChart: {
				data: buildReservationStatusChartData({
					createdSeries: createdSeries.data,
					confirmedSeries: confirmedSeries.data,
					cancelledSeries: cancelledSeries.data
				})
			},
			rows: buildReservationSourceRows(hospitalities, {
				createdTotals,
				confirmedTotals,
				cancelledTotals
			})
		};
	}
});
