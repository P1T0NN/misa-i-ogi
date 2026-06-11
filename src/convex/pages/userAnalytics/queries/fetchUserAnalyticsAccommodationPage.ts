// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getOwnedAccommodation } from '@/convex/tables/accommodations/helpers/getOwnedAccommodation';
import { getActivePartnershipsByAccommodation } from '@/convex/tables/partnerships/helpers/getActivePartnershipsByAccommodation';
import { getHospitalitiesByIds } from '@/convex/tables/hospitalities/helpers/getHospitalitiesByIds';

// UTILS
import { buildActivityData } from '@/convex/analytics/utils/buildActivityData';
import { buildAnalyticsRows } from '@/convex/analytics/utils/buildAnalyticsRows';
import { toComparedMetricWithValue } from '@/convex/analytics/utils/comparedMetricUtils';
import { getAnalyticsMetricValue } from '@/convex/analytics/utils/getAnalyticsMetricValue';
import { ANALYTICS_QUERY_RANGE_DAYS } from '@/convex/analytics/analyticsConstants';
import { createAnalyticsQueryDayRange } from '@/convex/analytics/utils/analyticsQueryRange';

// TYPES
import type { UserAnalyticsAccommodationDetailResult } from '../types/userAnalyticsTypes';

export const fetchUserAnalyticsAccommodationPage = query({
	args: {
		accommodationId: v.id('accommodations')
	},
	handler: async (ctx, args): Promise<UserAnalyticsAccommodationDetailResult> => {
		const userId = await requireAuthUserId(ctx);
		const accommodation = await getOwnedAccommodation(ctx, args.accommodationId, userId);
		if (!accommodation) {
			throw new Error('Accommodation not found');
		}

		const { from, to: todayStart } = createAnalyticsQueryDayRange();

		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('accommodationOwner', userId)
		} as const;

		const [
			dashboard,
			qrScanTotals,
			guestActivationTotals,
			reservationTotals,
			guestViewHospitalityTotals,
			partnerReservationTotals,
			partnerConfirmedTotals,
			qrScansSeries,
			guestActivationsSeries,
			reservationsSeries,
			partnershipGroups
		] = await Promise.all([
			analytics.fetchDashboardMetrics(ctx, {
				metrics: ['qrScans', 'guestActivations', 'newReservations'],
				scope: ownerScope,
				from,
				to: todayStart,
				includeComparison: true,
				includeEvaluation: true
			}),
			// --- Metric cards: totals keyed by accommodation so this page shows THIS stay only ---
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

			// --- Partner venue rows: totals keyed by hospitality ---
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
			}),

			// --- Time series for activity chart ---
			analytics.fetchTimeSeries(ctx, {
				metric: 'qrScans',
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

			// --- Partner hospitalities ---
			getActivePartnershipsByAccommodation(ctx, [args.accommodationId])
		]);

		// --- Resolve partner hospitalities ---
		const partnerships = partnershipGroups[0] ?? [];
		const hospitalityIds = partnerships.map((p) => p.hospitalityId);
		const hospitalities = await getHospitalitiesByIds(ctx, hospitalityIds);

		// --- Metric values for this accommodation only ---
		const qrScanValue = getAnalyticsMetricValue(qrScanTotals, args.accommodationId);
		const guestActivationValue = getAnalyticsMetricValue(
			guestActivationTotals,
			args.accommodationId
		);
		const reservationValue = getAnalyticsMetricValue(reservationTotals, args.accommodationId);

		return {
			accommodation: {
				id: accommodation._id,
				name: accommodation.name,
				type: accommodation.type,
				city: accommodation.city
			},
			metrics: {
				trackedStays: { value: 1 },
				qrScans: toComparedMetricWithValue(dashboard.metrics.qrScans, qrScanValue),
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
				qrScansSeries: qrScansSeries.data,
				guestActivationsSeries: guestActivationsSeries.data,
				reservationsSeries: reservationsSeries.data
			}),
			performance: {
				rows: buildAnalyticsRows({
					output: 'performance',
					items: hospitalities,
					primaryTotals: guestViewHospitalityTotals,
					requestTotals: partnerReservationTotals,
					confirmedTotals: partnerConfirmedTotals
				})
			}
		};
	}
});
