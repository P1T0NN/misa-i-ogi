// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import {
	ANALYTICS_CHART_LIMIT,
	ANALYTICS_QUERY_RANGE_DAYS
} from '@/convex/analytics/analyticsConstants';
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getUserOwnedHospitalities } from '@/convex/tables/hospitalities/helpers/getUserOwnedHospitalities';

// UTILS
import { buildUserAnalyticsChartData } from '@/convex/analytics/utils/buildUserAnalyticsChartData';
import { buildAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';
import {
	emptyMetricComparison,
	toComparedMetric
} from '@/convex/analytics/utils/comparedMetricUtils';
import { createAnalyticsQueryDayRange } from '@/convex/analytics/utils/analyticsQueryRange';

// TYPES
import type { UserAnalyticsHospitalitiesPageResult } from '../types/userAnalyticsTypes';

export const fetchUserAnalyticsHospitalitiesPage = query({
	args: {
		chartLimit: v.optional(v.number())
	},
	handler: async (ctx, args): Promise<UserAnalyticsHospitalitiesPageResult> => {
		const userId = await requireAuthUserId(ctx);
		const hospitalities = await getUserOwnedHospitalities(ctx, userId);

		if (hospitalities.length === 0) {
			return {
				metrics: {
					trackedVenues: { value: 0 },
					hospitalityViews: {
						value: 0,
						comparison: emptyMetricComparison()
					},
					guestActivations: {
						value: 0,
						comparison: emptyMetricComparison()
					},
					requestsGenerated: {
						value: 0,
						comparison: emptyMetricComparison()
					}
				},
				chart: { data: [] },
				rows: []
			};
		}

		const { from, to: todayStart } = createAnalyticsQueryDayRange();
		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('hospitalityOwner', userId)
		} as const;

		const [dashboard, hospitalityViewTotals, reservationTotals, confirmedTotals] =
			await Promise.all([
				analytics.fetchDashboardMetrics(ctx, {
					metrics: ['hospitalityViews', 'guestActivations', 'newReservations'],
					scope: ownerScope,
					from,
					to: todayStart,
					includeComparison: true,
					includeEvaluation: true
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'hospitalityViews',
					scope: ownerScope,
					dimensionKey: 'hospitalityId',
					days: ANALYTICS_QUERY_RANGE_DAYS
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
				})
			]);

		return {
			metrics: {
				trackedVenues: {
					value: hospitalities.length
				},
				hospitalityViews: toComparedMetric(dashboard.metrics.hospitalityViews),
				guestActivations: toComparedMetric(dashboard.metrics.guestActivations),
				requestsGenerated: toComparedMetric(dashboard.metrics.newReservations)
			},
			chart: {
				data: buildUserAnalyticsChartData({
					items: hospitalities,
					valueTotals: reservationTotals,
					tieBreakerTotals: hospitalityViewTotals,
					limit: args.chartLimit ?? ANALYTICS_CHART_LIMIT
				})
			},
			rows: buildAnalyticsRows({
				output: 'ranking',
				entity: 'hospitality',
				items: hospitalities,
				primaryTotals: hospitalityViewTotals,
				requestTotals: reservationTotals,
				confirmedTotals
			})
		};
	}
});
