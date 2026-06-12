// LIBRARIES
import { compareScores, getAnalyticsRanking } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { query, type QueryCtx } from '@/convex/_generated/server';

// HELPERS
import { requireAdmin } from '@/convex/auth/middleware/authMiddleware';
import { getAccommodationsByIds } from '@/convex/tables/accommodations/helpers/getAccommodationsByIds';
import { getHospitalitiesByIds } from '@/convex/tables/hospitalities/helpers/getHospitalitiesByIds';
import { uniqueIds } from '@/convex/helpers/uniqueIds';

// UTILS
import { getAnalyticsMetricValue } from '@/convex/analytics/utils/getAnalyticsMetricValue';
import {
	ANALYTICS_QUERY_RANGE_DAYS,
	ANALYTICS_RANKING_LIMIT
} from '@/convex/analytics/analyticsConstants';
import { createAnalyticsQueryDayRange } from '@/convex/analytics/utils/analyticsQueryRange';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type {
	AdminAnalyticsOverviewPageResult,
	AdminAnalyticsTopAccommodationRow,
	AdminAnalyticsTopHospitalityRow,
	AdminAnalyticsTrendPoint
} from '../types/adminAnalyticsTypes';

type AnalyticsMetricName =
	| 'qrScans'
	| 'guestActivations'
	| 'hospitalityViews'
	| 'newReservations'
	| 'confirmedReservations'
	| 'cancelledReservations';

async function fetchPlatformTimeSeries(
	ctx: QueryCtx,
	metric: AnalyticsMetricName,
	from: number,
	to: number
) {
	const result = await analytics.fetchTimeSeries(ctx, {
		metric,
		from,
		to,
		fill: true
	});

	return result.data;
}

async function fetchPlatformTotalsByDimension(
	ctx: QueryCtx,
	metric: AnalyticsMetricName,
	dimensionKey: 'accommodationId' | 'hospitalityId'
) {
	return analytics.fetchMetricTotalsByDimension(ctx, {
		metric,
		dimensionKey,
		days: ANALYTICS_QUERY_RANGE_DAYS
	});
}

function valuesByDate(data: Array<Record<string, number>>, metric: AnalyticsMetricName) {
	return new Map(data.map((point) => [point.date, point[metric] ?? 0]));
}

function buildTrend(args: {
	qrScans: Array<Record<string, number>>;
	guestActivations: Array<Record<string, number>>;
	hospitalityViews: Array<Record<string, number>>;
	newReservations: Array<Record<string, number>>;
	confirmedReservations: Array<Record<string, number>>;
}): AdminAnalyticsTrendPoint[] {
	const qrByDate = valuesByDate(args.qrScans, 'qrScans');
	const activationByDate = valuesByDate(args.guestActivations, 'guestActivations');
	const viewByDate = valuesByDate(args.hospitalityViews, 'hospitalityViews');
	const reservationByDate = valuesByDate(args.newReservations, 'newReservations');
	const confirmedByDate = valuesByDate(args.confirmedReservations, 'confirmedReservations');
	const dates = [...qrByDate.keys()].sort((first, second) => first - second);

	return dates.map((date) => ({
		date,
		qrScans: qrByDate.get(date) ?? 0,
		guestActivations: activationByDate.get(date) ?? 0,
		hospitalityViews: viewByDate.get(date) ?? 0,
		newReservations: reservationByDate.get(date) ?? 0,
		confirmedReservations: confirmedByDate.get(date) ?? 0
	}));
}

function orderByIds<TItem extends { _id: string }>(ids: string[], items: TItem[]) {
	const byId = new Map(items.map((item) => [item._id, item]));
	return ids.flatMap((id) => byId.get(id) ?? []);
}

async function buildTopAccommodations(ctx: QueryCtx): Promise<AdminAnalyticsTopAccommodationRow[]> {
	const [qrScanTotals, guestActivationTotals, reservationTotals, confirmedTotals] =
		await Promise.all([
			fetchPlatformTotalsByDimension(ctx, 'qrScans', 'accommodationId'),
			fetchPlatformTotalsByDimension(ctx, 'guestActivations', 'accommodationId'),
			fetchPlatformTotalsByDimension(ctx, 'newReservations', 'accommodationId'),
			fetchPlatformTotalsByDimension(ctx, 'confirmedReservations', 'accommodationId')
		]);
	const rankingIds = uniqueIds([
		...qrScanTotals.keys(),
		...guestActivationTotals.keys(),
		...reservationTotals.keys()
	]);
	const topIds = getAnalyticsRanking({
		items: rankingIds,
		getScore: (id) => qrScanTotals.get(id) ?? 0,
		tieBreakers: [
			(first, second) =>
				compareScores('desc', reservationTotals.get(first) ?? 0, reservationTotals.get(second) ?? 0)
		],
		limit: ANALYTICS_RANKING_LIMIT
	}) as Id<'accommodations'>[];

	if (topIds.length === 0) return [];

	const accommodations = orderByIds(topIds, await getAccommodationsByIds(ctx, topIds));

	return accommodations.map((accommodation) => ({
		id: accommodation._id,
		name: accommodation.name,
		type: accommodation.type,
		city: accommodation.city,
		scans: getAnalyticsMetricValue(qrScanTotals, accommodation._id),
		guestActivations: getAnalyticsMetricValue(guestActivationTotals, accommodation._id),
		reservations: getAnalyticsMetricValue(reservationTotals, accommodation._id),
		confirmed: getAnalyticsMetricValue(confirmedTotals, accommodation._id)
	}));
}

async function buildTopHospitalities(ctx: QueryCtx): Promise<AdminAnalyticsTopHospitalityRow[]> {
	const [viewTotals, reservationTotals, confirmedTotals] = await Promise.all([
		fetchPlatformTotalsByDimension(ctx, 'hospitalityViews', 'hospitalityId'),
		fetchPlatformTotalsByDimension(ctx, 'newReservations', 'hospitalityId'),
		fetchPlatformTotalsByDimension(ctx, 'confirmedReservations', 'hospitalityId')
	]);
	const rankingIds = uniqueIds([...viewTotals.keys(), ...reservationTotals.keys()]);
	const topIds = getAnalyticsRanking({
		items: rankingIds,
		getScore: (id) => reservationTotals.get(id) ?? 0,
		tieBreakers: [
			(first, second) =>
				compareScores('desc', viewTotals.get(first) ?? 0, viewTotals.get(second) ?? 0)
		],
		limit: ANALYTICS_RANKING_LIMIT
	}) as Id<'hospitalities'>[];

	if (topIds.length === 0) return [];

	const hospitalities = orderByIds(topIds, await getHospitalitiesByIds(ctx, topIds));

	return hospitalities.map((hospitality) => ({
		id: hospitality._id,
		name: hospitality.name,
		type: hospitality.type,
		city: hospitality.city,
		guestViews: getAnalyticsMetricValue(viewTotals, hospitality._id),
		reservations: getAnalyticsMetricValue(reservationTotals, hospitality._id),
		confirmed: getAnalyticsMetricValue(confirmedTotals, hospitality._id)
	}));
}

export const fetchAdminAnalyticsOverviewPage = query({
	args: {},
	handler: async (ctx): Promise<AdminAnalyticsOverviewPageResult> => {
		await requireAdmin(ctx);

		const { from, to: todayStart } = createAnalyticsQueryDayRange();

		const [
			dashboard,
			qrScansSeries,
			guestActivationsSeries,
			hospitalityViewsSeries,
			newReservationsSeries,
			confirmedReservationsSeries,
			topAccommodations,
			topHospitalities
		] = await Promise.all([
			analytics.fetchDashboardMetrics(ctx, {
				metrics: [
					'qrScans',
					'guestActivations',
					'hospitalityViews',
					'newReservations',
					'cancelledReservations'
				],
				from,
				to: todayStart,
				includeEvaluation: true
			}),
			fetchPlatformTimeSeries(ctx, 'qrScans', from, todayStart),
			fetchPlatformTimeSeries(ctx, 'guestActivations', from, todayStart),
			fetchPlatformTimeSeries(ctx, 'hospitalityViews', from, todayStart),
			fetchPlatformTimeSeries(ctx, 'newReservations', from, todayStart),
			fetchPlatformTimeSeries(ctx, 'confirmedReservations', from, todayStart),
			buildTopAccommodations(ctx),
			buildTopHospitalities(ctx)
		]);
		const trend = buildTrend({
			qrScans: qrScansSeries,
			guestActivations: guestActivationsSeries,
			hospitalityViews: hospitalityViewsSeries,
			newReservations: newReservationsSeries,
			confirmedReservations: confirmedReservationsSeries
		});

		return {
			metrics: {
				qrScans: dashboard.metrics.qrScans,
				guestActivations: dashboard.metrics.guestActivations,
				hospitalityViews: dashboard.metrics.hospitalityViews,
				newReservations: dashboard.metrics.newReservations,
				cancelledReservations: dashboard.metrics.cancelledReservations
			},
			trend,
			topAccommodations,
			topHospitalities
		};
	}
});
