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
import { buildPerformanceRows } from '@/convex/analytics/utils/buildPerformanceRows';
import { sumAnalyticsMetricTotals } from '@/convex/analytics/utils/sumAnalyticsMetricTotals';
import { getAnalyticsMetricValue } from '@/convex/analytics/utils/getAnalyticsMetricValue';
import { DAY_MS, startOfUtcDay } from '../utils/dateUtils';

// TYPES
import type { UserAnalyticsAccommodationDetailResult } from '../types/userAnalyticsTypes';

const RANGE_DAYS = 30;

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

		const todayStart = startOfUtcDay(Date.now());
		const from = todayStart - DAY_MS * (RANGE_DAYS - 1);

		const ownerScope = {
			type: 'organization',
			id: createAnalyticsScopeId('accommodationOwner', userId)
		} as const;

		const [
			qrScanTotals,
			guestViewHospitalityTotals,
			guestActivationTotals,
			reservationTotals,
			confirmedTotals,
			qrScanComparison,
			guestActivationComparison,
			reservationComparison,
			qrScansSeries,
			guestActivationsSeries,
			reservationsSeries,
			partnershipGroups
		] = await Promise.all([
			// --- QR scans for this accommodation ---
			analytics.fetchMetricTotalsByDimension(ctx, {
				metric: 'qrScans',
				scope: ownerScope,
				dimensionKey: 'accommodationId',
				days: RANGE_DAYS
			}),

			// --- Guest views for partner rows ---
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

			// --- Comparisons for the metric cards ---
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

		// --- Aggregate metric values ---
		const qrScanValue = getAnalyticsMetricValue(qrScanTotals, args.accommodationId);
		const guestActivationValue = sumAnalyticsMetricTotals(guestActivationTotals);
		const reservationValue = sumAnalyticsMetricTotals(reservationTotals);

		return {
			accommodation: {
				id: accommodation._id,
				name: accommodation.name,
				type: accommodation.type,
				city: accommodation.city
			},
			metrics: {
				trackedStays: { value: 1 },
				qrScans: {
					value: qrScanValue,
					comparison: qrScanComparison
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
				qrScansSeries: qrScansSeries.data,
				guestActivationsSeries: guestActivationsSeries.data,
				reservationsSeries: reservationsSeries.data
			}),
			performance: {
				rows: buildPerformanceRows({
					items: hospitalities,
					viewTotals: guestViewHospitalityTotals,
					requestTotals: reservationTotals,
					confirmedTotals
				})
			}
		};
	}
});
