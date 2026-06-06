// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import { ANALYTICS_CHART_LIMIT } from '@/convex/projectSettings';
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getUserOwnedHospitalities } from '@/convex/tables/hospitalities/helpers/getUserOwnedHospitalities';

// UTILS
import { buildUserAnalyticsHospitalitiesChartData } from '@/convex/analytics/utils/buildUserAnalyticsHospitalitiesChartData';
import { buildUserAnalyticsHospitalitiesRows } from '@/convex/analytics/utils/buildUserAnalyticsHospitalitiesRows';
import { sumAnalyticsMetricTotals } from '@/convex/analytics/utils/sumAnalyticsMetricTotals';
import { DAY_MS, startOfUtcDay } from '../utils/dateUtils';

// TYPES
import type { UserAnalyticsHospitalitiesPageResult } from '../types/userAnalyticsTypes';

const RANGE_DAYS = 30;

export const fetchUserAnalyticsHospitalitiesPage = query({
	args: {
		chartLimit: v.optional(v.number())
	},
	handler: async (ctx, args): Promise<UserAnalyticsHospitalitiesPageResult> => {
		const userId = await requireAuthUserId(ctx);
		const todayStart = startOfUtcDay(Date.now());
		const from = todayStart - DAY_MS * (RANGE_DAYS - 1);
		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('hospitalityOwner', userId)
		} as const;

		const [
			hospitalities,
			guestViewTotals,
			guestActivationTotals,
			reservationTotals,
			confirmedTotals,
			guestViewComparison,
			guestActivationComparison,
			reservationComparison
		] = await Promise.all([
			getUserOwnedHospitalities(ctx, userId),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'guestViews',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'guestActivations',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'newReservations',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'confirmedReservations',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricComparison(ctx, {
				metric: 'guestViews',
				scope: ownerScope,
				from,
				to: todayStart
			}),
			analytics.fetchMetricComparison(ctx, {
				metric: 'guestActivations',
				scope: ownerScope,
				from,
				to: todayStart
			}),
			analytics.fetchMetricComparison(ctx, {
				metric: 'newReservations',
				scope: ownerScope,
				from,
				to: todayStart
			})
		]);

		return {
			metrics: {
				trackedVenues: {
					value: hospitalities.length
				},
				guestViews: {
					value: sumAnalyticsMetricTotals(guestViewTotals),
					comparison: guestViewComparison
				},
				guestActivations: {
					value: sumAnalyticsMetricTotals(guestActivationTotals),
					comparison: guestActivationComparison
				},
				requestsGenerated: {
					value: sumAnalyticsMetricTotals(reservationTotals),
					comparison: reservationComparison
				}
			},
			chart: {
				data: buildUserAnalyticsHospitalitiesChartData({
					hospitalities,
					reservationTotals,
					guestViewTotals,
					limit: args.chartLimit ?? ANALYTICS_CHART_LIMIT
				})
			},
			rows: buildUserAnalyticsHospitalitiesRows({
				hospitalities,
				guestViewTotals,
				guestActivationTotals,
				reservationTotals,
				confirmedTotals
			})
		};
	}
});
