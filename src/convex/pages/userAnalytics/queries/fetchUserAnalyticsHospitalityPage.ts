// LIBRARIES
import { ConvexError, v } from 'convex/values';
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
import { buildAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';
import { toComparedMetricWithValue } from '@/convex/analytics/utils/comparedMetricUtils';
import { getAnalyticsMetricValue } from '@/convex/analytics/utils/getAnalyticsMetricValue';
import { ANALYTICS_QUERY_RANGE_DAYS } from '@/convex/analytics/analyticsConstants';
import { createAnalyticsQueryDayRange } from '@/convex/analytics/utils/analyticsQueryRange';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { UserAnalyticsHospitalityDetailResult } from '../types/userAnalyticsTypes';

export const fetchUserAnalyticsHospitalityPage = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	handler: async (ctx, args): Promise<UserAnalyticsHospitalityDetailResult> => {
		const userId = await requireAuthUserId(ctx);
		const hospitality = await getOwnedHospitality(ctx, args.hospitalityId, userId);
		if (!hospitality) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' }
			} satisfies ConvexErrorPayload);
		}

		const { from, to: todayStart } = createAnalyticsQueryDayRange();

		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('hospitalityOwner', userId)
		} as const;

		const [
			dashboard,
			hospitalityViewSourceTotals,
			guestActivationTotals,
			reservationTotals,
			confirmedTotals,
			hospitalityViewTotals,
			hospitalityReservationTotals,
			hospitalityViewsSeries,
			guestActivationsSeries,
			reservationsSeries,
			partnershipGroups
		] = await Promise.all([
			analytics.fetchDashboardMetrics(ctx, {
				metrics: ['hospitalityViews', 'guestActivations', 'newReservations'],
				scope: ownerScope,
				from,
				to: todayStart,
				includeComparison: true,
				includeEvaluation: true
			}),
			// --- Aggregate source accommodation totals for partner rows ---
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'hospitalityViews',
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
			}),

			// --- Guest views and reservations for this specific hospitality ---
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

		// --- Metric values for this hospitality only ---
		// Activations happen at accommodations, so attribute them via this venue's partner stays.
		const partnerAccommodationIds = new Set<string>(accommodationIds);
		let guestActivationValue = 0;
		for (const [accommodationId, value] of guestActivationTotals) {
			if (partnerAccommodationIds.has(accommodationId)) guestActivationValue += value;
		}

		const reservationValue = getAnalyticsMetricValue(
			hospitalityReservationTotals,
			args.hospitalityId
		);
		const hospitalityViewValue = getAnalyticsMetricValue(hospitalityViewTotals, args.hospitalityId);

		return {
			hospitality: {
				id: hospitality._id,
				name: hospitality.name,
				type: hospitality.type,
				city: hospitality.city
			},
			metrics: {
				trackedVenues: { value: 1 },
				hospitalityViews: toComparedMetricWithValue(
					dashboard.metrics.hospitalityViews,
					hospitalityViewValue
				),
				guestActivations: toComparedMetricWithValue(
					dashboard.metrics.guestActivations,
					guestActivationValue
				),
				requestsGenerated: toComparedMetricWithValue(
					dashboard.metrics.newReservations,
					reservationValue
				)
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
				rows: buildAnalyticsRows({
					output: 'performance',
					items: accommodations,
					primaryTotals: hospitalityViewSourceTotals,
					requestTotals: reservationTotals,
					confirmedTotals
				})
			}
		};
	}
});
