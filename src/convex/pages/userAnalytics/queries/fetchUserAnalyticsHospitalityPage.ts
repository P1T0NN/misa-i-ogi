// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getOwnedHospitality } from '@/convex/tables/hospitalities/helpers/getOwnedHospitality';
import { getActivePartnershipsByHospitality } from '@/convex/tables/partnerships/helpers/getActivePartnershipsByHospitality';
import { getAccommodationsByIds } from '@/convex/tables/accommodations/helpers/getAccommodationsByIds';

// UTILS
import { buildActivityData } from '@/convex/analytics/utils/buildActivityData';
import { buildPerformanceRows } from '@/convex/analytics/utils/buildPerformanceRows';
import { sumAnalyticsMetricTotals } from '@/convex/analytics/utils/sumAnalyticsMetricTotals';
import { getAnalyticsMetricValue } from '@/convex/analytics/utils/getAnalyticsMetricValue';
import { DAY_MS, startOfUtcDay } from '../utils/dateUtils';

// TYPES
import type { UserAnalyticsHospitalityDetailResult } from '../types/userAnalyticsTypes';

const RANGE_DAYS = 30;

export const fetchUserAnalyticsHospitalityPage = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	handler: async (ctx, args): Promise<UserAnalyticsHospitalityDetailResult> => {
		const userId = await requireAuthUserId(ctx);
		const hospitality = await getOwnedHospitality(ctx, args.hospitalityId, userId);
		if (!hospitality) {
			throw new Error('Hospitality not found');
		}

		const todayStart = startOfUtcDay(Date.now());
		const from = todayStart - DAY_MS * (RANGE_DAYS - 1);

		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('hospitalityOwner', userId)
		} as const;

		const [
			hospitalityViewSourceTotals,
			guestActivationTotals,
			reservationTotals,
			confirmedTotals,
			hospitalityViewTotals,
			hospitalityViewComparison,
			guestActivationComparison,
			reservationComparison,
			hospitalityViewsSeries,
			guestActivationsSeries,
			reservationsSeries,
			partnershipGroups
		] = await Promise.all([
			// --- Aggregate source accommodation totals for partner rows ---
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'hospitalityViews',
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

			// --- Guest views for this specific hospitality ---
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'hospitalityViews',
				scope: ownerScope,
				dimensionKey: 'hospitalityId',
				days: RANGE_DAYS
			}),

			// --- Comparisons for the metric cards ---
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
			}),

			// --- Time series for activity chart ---
			analytics.fetchTimeSeries(ctx, {
				metric: 'hospitalityViews',
				scope: ownerScope,
				from,
				to: todayStart,
				fill: true
			}),
			analytics.fetchTimeSeries(ctx, {
				metric: 'guestActivations',
				scope: ownerScope,
				from,
				to: todayStart,
				fill: true
			}),
			analytics.fetchTimeSeries(ctx, {
				metric: 'newReservations',
				scope: ownerScope,
				from,
				to: todayStart,
				fill: true
			}),

			// --- Partner accommodations ---
			getActivePartnershipsByHospitality(ctx, [args.hospitalityId])
		]);

		// --- Resolve partner accommodations ---
		const partnerships = partnershipGroups[0] ?? [];
		const accommodationIds = partnerships.map((p) => p.accommodationId);
		const accommodations = await getAccommodationsByIds(ctx, accommodationIds);

		// --- Aggregate metric values ---
		const guestActivationValue = sumAnalyticsMetricTotals(guestActivationTotals);
		const reservationValue = sumAnalyticsMetricTotals(reservationTotals);
		const hospitalityViewValue = getAnalyticsMetricValue(
			hospitalityViewTotals,
			args.hospitalityId
		);

		return {
			hospitality: {
				id: hospitality._id,
				name: hospitality.name,
				type: hospitality.type,
				city: hospitality.city
			},
			metrics: {
				trackedVenues: { value: 1 },
				hospitalityViews: {
					value: hospitalityViewValue,
					comparison: hospitalityViewComparison
				},
				guestActivations: {
					value: guestActivationValue,
					comparison: guestActivationComparison
				},
				requestsGenerated: {
					value: reservationValue,
					comparison: reservationComparison
				}
			},
			activityData: buildActivityData({
				qrScansSeries: hospitalityViewsSeries.data.map((point) => ({
					...point,
					qrScans: point.hospitalityViews ?? 0
				})),
				guestActivationsSeries: guestActivationsSeries.data,
				reservationsSeries: reservationsSeries.data
			}),
			performance: {
				rows: buildPerformanceRows({
					items: accommodations,
					viewTotals: hospitalityViewSourceTotals,
					requestTotals: reservationTotals,
					confirmedTotals
				})
			}
		};
	}
});
