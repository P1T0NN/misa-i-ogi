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
import { buildUserAnalyticsChartData } from '@/convex/analytics/utils/buildUserAnalyticsChartData';
import { buildAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';
import { createEmptyMetricComparison } from '@/convex/analytics/utils/createEmptyMetricComparison';
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
		const hospitalities = await getUserOwnedHospitalities(ctx, userId);

		if (hospitalities.length === 0) {
			return {
				metrics: {
					trackedVenues: { value: 0 },
					hospitalityViews: {
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
			id: createAnalyticsScopeId('hospitalityOwner', userId)
		} as const;

		const [
			hospitalityViewTotals,
			guestActivationTotals,
			reservationTotals,
			confirmedTotals,
			hospitalityViewComparison,
			guestActivationComparison,
			reservationComparison
		] = await Promise.all([
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'hospitalityViews',
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
				metric: 'hospitalityViews',
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
				hospitalityViews: {
					value: sumAnalyticsMetricTotals(hospitalityViewTotals),
					comparison: hospitalityViewComparison
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
					items: hospitalities,
					valueTotals: reservationTotals,
					tieBreakerTotals: hospitalityViewTotals,
					limit: args.chartLimit ?? ANALYTICS_CHART_LIMIT
				})
			},
			rows: buildAnalyticsRows({
				output: 'ranking',
				items: hospitalities,
				primaryTotals: hospitalityViewTotals,
				secondaryTotals: guestActivationTotals,
				requestTotals: reservationTotals,
				confirmedTotals
			})
		};
	}
});
