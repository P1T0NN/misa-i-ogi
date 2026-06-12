// LIBRARIES
import { compareScores, getAnalyticsRanking } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';

// HELPERS
import { uniqueIds } from '@/convex/helpers/uniqueIds';

// UTILS
import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

// TYPES
import type {
	UserAnalyticsAccommodationTableRow,
	UserAnalyticsHospitalityTableRow,
	UserAnalyticsPlaceDetailPerformanceRow
} from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
import type { QueryCtx } from '@/convex/_generated/server';

type AnalyticsEntityItem = {
	_id: string;
	name: string;
	type: string;
	city: string;
	isActive?: boolean;
};

type BuildAnalyticsRowsBase<TItem extends AnalyticsEntityItem> = {
	items: TItem[];
	primaryTotals: Map<string, number>;
	requestTotals: Map<string, number>;
	confirmedTotals: Map<string, number>;
};

type BuildAnalyticsRowsRankingAccommodation<TItem extends AnalyticsEntityItem> =
	BuildAnalyticsRowsBase<TItem> & {
		output: 'ranking';
		entity: 'accommodation';
		guestActivationTotals: Map<string, number>;
		/** Default `true`. Pass `false` when items are already ranked (e.g. overview top N). */
		sortByPrimary?: boolean;
	};

type BuildAnalyticsRowsRankingHospitality<TItem extends AnalyticsEntityItem> =
	BuildAnalyticsRowsBase<TItem> & {
		output: 'ranking';
		entity: 'hospitality';
		/** Default `true`. Pass `false` when items are already ranked (e.g. overview top N). */
		sortByPrimary?: boolean;
	};

type BuildAnalyticsRowsPerformance<TItem extends AnalyticsEntityItem> =
	BuildAnalyticsRowsBase<TItem> & {
		output: 'performance';
	};

type FetchMetricTotalsByDimensionArgs = Parameters<
	typeof analytics.fetchMetricTotalsByDimension
>[1];
type AnalyticsMetric = FetchMetricTotalsByDimensionArgs['metric'];
type AnalyticsScope = FetchMetricTotalsByDimensionArgs['scope'];
type AnalyticsDimensionKey = FetchMetricTotalsByDimensionArgs['dimensionKey'];

type BuildTopAnalyticsRowsArgs<
	TId extends string,
	TItem extends AnalyticsEntityItem & { isActive: boolean }
> = {
	ctx: QueryCtx;
	scope: AnalyticsScope;
	dimensionKey: AnalyticsDimensionKey;
	limit: number;
	getItemsByIds: (ctx: QueryCtx, ids: TId[]) => Promise<TItem[]>;
	candidateMetrics: AnalyticsMetric[];
	scoreMetric: AnalyticsMetric;
	primaryMetric: AnalyticsMetric;
	secondaryMetric?: AnalyticsMetric;
	requestMetric: AnalyticsMetric;
	confirmedMetric: AnalyticsMetric;
	tieBreakerMetrics?: AnalyticsMetric[];
};

/** Keeps a pre-ranked id list when hydrating entities from the database. */
function orderAnalyticsEntitiesByIds<TItem extends { _id: string }>(
	ids: string[],
	items: TItem[]
): TItem[] {
	const itemById = new Map(items.map((item) => [item._id, item]));
	return ids.flatMap((id) => itemById.get(id) ?? []);
}

export async function buildTopAnalyticsRows<
	TId extends string,
	TItem extends AnalyticsEntityItem & { isActive: boolean }
>(
	args: BuildTopAnalyticsRowsArgs<TId, TItem> & { entity: 'accommodation' }
): Promise<UserAnalyticsAccommodationTableRow[]>;

export async function buildTopAnalyticsRows<
	TId extends string,
	TItem extends AnalyticsEntityItem & { isActive: boolean }
>(
	args: BuildTopAnalyticsRowsArgs<TId, TItem> & { entity: 'hospitality' }
): Promise<UserAnalyticsHospitalityTableRow[]>;

export async function buildTopAnalyticsRows<
	TId extends string,
	TItem extends AnalyticsEntityItem & { isActive: boolean }
>(
	args: BuildTopAnalyticsRowsArgs<TId, TItem> & {
		entity: 'accommodation' | 'hospitality';
	}
): Promise<UserAnalyticsAccommodationTableRow[] | UserAnalyticsHospitalityTableRow[]> {
	const requestedMetrics = uniqueIds(
		[
			...args.candidateMetrics,
			args.scoreMetric,
			args.primaryMetric,
			args.secondaryMetric,
			args.requestMetric,
			args.confirmedMetric,
			...(args.tieBreakerMetrics ?? [])
		].filter((metric): metric is AnalyticsMetric => metric !== undefined)
	);

	const metricEntries = await Promise.all(
		requestedMetrics.map(async (metric) => {
			const totals = await analytics.fetchMetricTotalsByDimension(args.ctx, {
				metric,
				scope: args.scope,
				dimensionKey: args.dimensionKey
			});

			return [metric, totals] as const;
		})
	);
	const totalsByMetric = new Map(metricEntries);
	const emptyTotals = new Map<string, number>();
	const getTotals = (metric: AnalyticsMetric) => totalsByMetric.get(metric) ?? emptyTotals;

	const rankingIds = uniqueIds(
		args.candidateMetrics.flatMap((metric) => [...getTotals(metric).keys()])
	) as TId[];
	const topIds = getAnalyticsRanking({
		items: rankingIds,
		getScore: (id) => getTotals(args.scoreMetric).get(id) ?? 0,
		tieBreakers: (args.tieBreakerMetrics ?? []).map(
			(metric) => (first, second) =>
				compareScores('desc', getTotals(metric).get(first) ?? 0, getTotals(metric).get(second) ?? 0)
		),
		limit: args.limit
	}) as TId[];

	if (topIds.length === 0) return [];

	const items = await args.getItemsByIds(args.ctx, topIds);
	const orderedItems = orderAnalyticsEntitiesByIds(topIds, items);

	if (args.entity === 'accommodation') {
		return buildAnalyticsRows({
			output: 'ranking',
			entity: 'accommodation',
			sortByPrimary: false,
			items: orderedItems,
			primaryTotals: getTotals(args.primaryMetric),
			guestActivationTotals: getTotals(args.secondaryMetric ?? args.primaryMetric),
			requestTotals: getTotals(args.requestMetric),
			confirmedTotals: getTotals(args.confirmedMetric)
		});
	}

	return buildAnalyticsRows({
		output: 'ranking',
		entity: 'hospitality',
		sortByPrimary: false,
		items: orderedItems,
		primaryTotals: getTotals(args.primaryMetric),
		requestTotals: getTotals(args.requestMetric),
		confirmedTotals: getTotals(args.confirmedMetric)
	});
}

export function buildAnalyticsRows<TItem extends AnalyticsEntityItem & { isActive: boolean }>(
	args: BuildAnalyticsRowsRankingAccommodation<TItem>
): UserAnalyticsAccommodationTableRow[];

export function buildAnalyticsRows<TItem extends AnalyticsEntityItem & { isActive: boolean }>(
	args: BuildAnalyticsRowsRankingHospitality<TItem>
): UserAnalyticsHospitalityTableRow[];

export function buildAnalyticsRows<TItem extends AnalyticsEntityItem>(
	args: BuildAnalyticsRowsPerformance<TItem>
): UserAnalyticsPlaceDetailPerformanceRow<TItem['type']>[];

export function buildAnalyticsRows<TItem extends AnalyticsEntityItem>(
	args:
		| BuildAnalyticsRowsRankingAccommodation<TItem>
		| BuildAnalyticsRowsRankingHospitality<TItem>
		| BuildAnalyticsRowsPerformance<TItem>
):
	| UserAnalyticsAccommodationTableRow[]
	| UserAnalyticsHospitalityTableRow[]
	| UserAnalyticsPlaceDetailPerformanceRow[] {
	const items =
		args.output === 'ranking' && args.sortByPrimary !== false
			? sortAnalyticsItemsByMetric(args.items, args.primaryTotals, args.requestTotals)
			: args.items;

	if (args.output === 'performance') {
		return items
			.map((item) => {
				const views = getAnalyticsMetricValue(args.primaryTotals, item._id);
				const requests = getAnalyticsMetricValue(args.requestTotals, item._id);
				const confirmed = getAnalyticsMetricValue(args.confirmedTotals, item._id);

				return {
					id: item._id,
					name: item.name,
					type: item.type,
					city: item.city,
					views,
					requests,
					confirmed
				};
			})
			.filter((row) => row.views > 0 || row.requests > 0)
			.sort(
				(first, second) =>
					compareScores('desc', first.views, second.views) ||
					compareScores('desc', first.requests, second.requests)
			);
	}

	if (args.entity === 'accommodation') {
		return items.map((item) => ({
			id: item._id,
			name: item.name,
			type: item.type,
			city: item.city,
			isActive: item.isActive ?? true,
			scans: getAnalyticsMetricValue(args.primaryTotals, item._id),
			guestActivations: getAnalyticsMetricValue(args.guestActivationTotals, item._id),
			reservations: getAnalyticsMetricValue(args.requestTotals, item._id),
			confirmed: getAnalyticsMetricValue(args.confirmedTotals, item._id)
		}));
	}

	return items.map((item) => ({
		id: item._id,
		name: item.name,
		type: item.type,
		city: item.city,
		isActive: item.isActive ?? true,
		guestViews: getAnalyticsMetricValue(args.primaryTotals, item._id),
		reservations: getAnalyticsMetricValue(args.requestTotals, item._id),
		confirmed: getAnalyticsMetricValue(args.confirmedTotals, item._id)
	}));
}
