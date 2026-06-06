// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import { ANALYTICS_CHART_LIMIT } from '@/convex/projectSettings';
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getUserOwnedAccommodations } from '@/convex/tables/accommodations/helpers/getUserOwnedAccommodations';

// UTILS
import { buildUserAnalyticsAccommodationChartData } from '@/convex/analytics/utils/buildUserAnalyticsAccommodationChartData';
import { buildUserAnalyticsAccommodationRows } from '@/convex/analytics/utils/buildUserAnalyticsAccommodationRows';
import { sumAnalyticsMetricTotals } from '@/convex/analytics/utils/sumAnalyticsMetricTotals';
import { DAY_MS, startOfUtcDay } from '../utils/dateUtils';

// TYPES
import type { UserAnalyticsAccommodationsPageResult } from '../types/userAnalyticsTypes';

const RANGE_DAYS = 30;

export const fetchUserAnalyticsAccommodationsPage = query({
	args: {
		chartLimit: v.optional(v.number())
	},
	handler: async (ctx, args): Promise<UserAnalyticsAccommodationsPageResult> => {
		const userId = await requireAuthUserId(ctx);
		const todayStart = startOfUtcDay(Date.now());
		const from = todayStart - DAY_MS * (RANGE_DAYS - 1);
		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('accommodationOwner', userId)
		} as const;

		const [
			accommodations,
			qrScanTotals,
			guestActivationTotals,
			reservationTotals,
			confirmedTotals,
			qrScanComparison,
			guestActivationComparison,
			reservationComparison
		] = await Promise.all([
			getUserOwnedAccommodations(ctx, userId),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'qrScans',
				scope: ownerScope,
				dimensionKey: 'accommodationId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'guestActivations',
				scope: ownerScope,
				dimensionKey: 'accommodationId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'newReservations',
				scope: ownerScope,
				dimensionKey: 'accommodationId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'confirmedReservations',
				scope: ownerScope,
				dimensionKey: 'accommodationId',
				days: RANGE_DAYS
			}),
			analytics.fetchMetricComparison(ctx, {
				metric: 'qrScans',
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
				trackedStays: {
					value: accommodations.length
				},
				qrScans: {
					value: sumAnalyticsMetricTotals(qrScanTotals),
					comparison: qrScanComparison
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
				data: buildUserAnalyticsAccommodationChartData({
					accommodations,
					reservationTotals,
					qrScanTotals,
					limit: args.chartLimit ?? ANALYTICS_CHART_LIMIT
				})
			},
			rows: buildUserAnalyticsAccommodationRows({
				accommodations,
				qrScanTotals,
				guestActivationTotals,
				reservationTotals,
				confirmedTotals
			})
		};
	}
});
