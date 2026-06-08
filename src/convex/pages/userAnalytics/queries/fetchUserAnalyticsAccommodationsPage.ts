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
import { buildUserAnalyticsChartData } from '@/convex/analytics/utils/buildUserAnalyticsChartData';
import { buildAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';
import { createEmptyMetricComparison } from '@/convex/analytics/utils/createEmptyMetricComparison';
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
		const accommodations = await getUserOwnedAccommodations(ctx, userId);

		if (accommodations.length === 0) {
			return {
				metrics: {
					trackedStays: { value: 0 },
					qrScans: {
						value: 0,
						comparison: createEmptyMetricComparison()
					},
					guestActivations: {
						value: 0,
						comparison: createEmptyMetricComparison()
					},
					requestsGenerated: {
						value: 0,
						comparison: createEmptyMetricComparison()
					}
				},
				chart: { data: [] },
				rows: []
			};
		}

		const todayStart = startOfUtcDay(Date.now());
		const from = todayStart - DAY_MS * (RANGE_DAYS - 1);
		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('accommodationOwner', userId)
		} as const;

		const [
			qrScanTotals,
			guestActivationTotals,
			reservationTotals,
			confirmedTotals,
			qrScanComparison,
			guestActivationComparison,
			reservationComparison
		] = await Promise.all([
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
				data: buildUserAnalyticsChartData({
					items: accommodations,
					valueTotals: reservationTotals,
					tieBreakerTotals: qrScanTotals,
					limit: args.chartLimit ?? ANALYTICS_CHART_LIMIT
				})
			},
			rows: buildAnalyticsRows({
				output: 'ranking',
				items: accommodations,
				primaryTotals: qrScanTotals,
				secondaryTotals: guestActivationTotals,
				requestTotals: reservationTotals,
				confirmedTotals
			})
		};
	}
});
