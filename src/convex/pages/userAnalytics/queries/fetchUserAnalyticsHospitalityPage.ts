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
			reservationTotals,
			confirmedTotals,
			hospitalityViewTotals,
			hospitalityReservationTotals,
			hospitalityConfirmedTotals,
			partnershipGroups
		] = await Promise.all([
			analytics.fetchDashboardMetrics(ctx, {
				metrics: ['hospitalityViews', 'newReservations', 'confirmedReservations'],
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

			// --- Guest views, reservations, confirmations for this specific hospitality ---
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

			// --- Partner accommodations ---
			getActivePartnershipsByHospitality(ctx, [args.hospitalityId])
		]);

		// --- Resolve partner accommodations ---
		const partnerships = partnershipGroups[0] ?? [];
		const accommodationIds = partnerships.map((p) => p.accommodationId);
		const accommodations = await getAccommodationsByIds(ctx, accommodationIds);

		// --- Metric values for this hospitality only ---
		const reservationValue = getAnalyticsMetricValue(
			hospitalityReservationTotals,
			args.hospitalityId
		);
		const hospitalityViewValue = getAnalyticsMetricValue(hospitalityViewTotals, args.hospitalityId);
		const confirmedValue = getAnalyticsMetricValue(hospitalityConfirmedTotals, args.hospitalityId);

		return {
			hospitality: {
				id: hospitality._id,
				name: hospitality.name,
				type: hospitality.type,
				city: hospitality.city
			},
			metrics: {
				hospitalityViews: toComparedMetricWithValue(
					dashboard.metrics.hospitalityViews,
					hospitalityViewValue
				),
				requestsGenerated: toComparedMetricWithValue(
					dashboard.metrics.newReservations,
					reservationValue
				),
				confirmedReservations: toComparedMetricWithValue(
					dashboard.metrics.confirmedReservations,
					confirmedValue
				)
			},
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
