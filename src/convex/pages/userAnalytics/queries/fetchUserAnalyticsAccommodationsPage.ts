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
import { getUserOwnedAccommodations } from '@/convex/tables/accommodations/helpers/getUserOwnedAccommodations';

// UTILS
import { buildUserAnalyticsChartData } from '@/convex/analytics/utils/buildUserAnalyticsChartData';
import { buildAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';
import {
	emptyMetricComparison,
	toComparedMetric
} from '@/convex/analytics/utils/comparedMetricUtils';
import { createAnalyticsQueryDayRange } from '@/convex/analytics/utils/analyticsQueryRange';

// TYPES
import type { UserAnalyticsAccommodationsPageResult } from '../types/userAnalyticsTypes';

export const fetchUserAnalyticsAccommodationsPage = query({
	args: {
		chartLimit: v.optional(v.number())
	},
	handler: async (ctx, args): Promise<UserAnalyticsAccommodationsPageResult> => {
		const userId = await requireAuthUserId(ctx);
		const accommodations = await getUserOwnedAccommodations(ctx, userId);

		if (accommodations.length === 0) {
			return {
				metrics: {
					qrScans: {
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
					},
					confirmedReservations: {
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
			id: createAnalyticsScopeId('accommodationOwner', userId)
		} as const;

		const [dashboard, qrScanTotals, guestActivationTotals, reservationTotals, confirmedTotals] =
			await Promise.all([
				analytics.fetchDashboardMetrics(ctx, {
					metrics: ['qrScans', 'guestActivations', 'newReservations', 'confirmedReservations'],
					scope: ownerScope,
					from,
					to: todayStart,
					includeComparison: true,
					includeEvaluation: true
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'qrScans',
					scope: ownerScope,
					dimensionKey: 'accommodationId',
					days: ANALYTICS_QUERY_RANGE_DAYS
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'guestActivations',
					scope: ownerScope,
					dimensionKey: 'accommodationId',
					days: ANALYTICS_QUERY_RANGE_DAYS
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'newReservations',
					scope: ownerScope,
					dimensionKey: 'accommodationId',
					days: ANALYTICS_QUERY_RANGE_DAYS
				}),
				analytics.fetchMetricTotalsByDimension(ctx, {
					metric: 'confirmedReservations',
					scope: ownerScope,
					dimensionKey: 'accommodationId',
					days: ANALYTICS_QUERY_RANGE_DAYS
				})
			]);

		return {
			metrics: {
				qrScans: toComparedMetric(dashboard.metrics.qrScans),
				guestActivations: toComparedMetric(dashboard.metrics.guestActivations),
				requestsGenerated: toComparedMetric(dashboard.metrics.newReservations),
				confirmedReservations: toComparedMetric(dashboard.metrics.confirmedReservations)
			},
			chart: {
				data: buildUserAnalyticsChartData({
					items: accommodations,
					valueTotals: reservationTotals,
					tieBreakerTotals: qrScanTotals,
					limit: args.chartLimit ?? ANALYTICS_CHART_LIMIT
				})
			},
			rows: buildAnalyticsRows({
				output: 'ranking',
				entity: 'accommodation',
				items: accommodations,
				primaryTotals: qrScanTotals,
				guestActivationTotals: guestActivationTotals,
				requestTotals: reservationTotals,
				confirmedTotals
			})
		};
	}
});
