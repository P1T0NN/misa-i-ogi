// LIBRARIES
import { getAnalyticsRanking } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';

// HELPERS
import { uniqueIds } from '@/convex/helpers/uniqueIds';

// UTILS
import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

// TYPES
import type {
	UserAnalyticsPlaceDetailPerformanceRow,
	UserAnalyticsRankingRow
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

type BuildAnalyticsRowsRanking<TItem extends AnalyticsEntityItem> =
	BuildAnalyticsRowsBase<TItem> & {
		output: 'ranking';
		secondaryTotals?: Map<string, number>;
		/** Default `true`. Pass `false` when items are already ranked (e.g. overview top N). */
		sortByPrimary?: boolean;
	};

type BuildAnalyticsRowsPerformance<TItem extends AnalyticsEntityItem> = BuildAnalyticsRowsBase<TItem> & {
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
>(args: BuildTopAnalyticsRowsArgs<TId, TItem>): Promise<UserAnalyticsRankingRow[]> {
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
				(getTotals(metric).get(second) ?? 0) - (getTotals(metric).get(first) ?? 0)
		),
		limit: args.limit
	}) as TId[];

	if (topIds.length === 0) return [];

	const items = await args.getItemsByIds(args.ctx, topIds);

	return buildAnalyticsRows({
		output: 'ranking',
		sortByPrimary: false,
		items: orderAnalyticsEntitiesByIds(topIds, items),
		primaryTotals: getTotals(args.primaryMetric),
		secondaryTotals: args.secondaryMetric ? getTotals(args.secondaryMetric) : undefined,
		requestTotals: getTotals(args.requestMetric),
		confirmedTotals: getTotals(args.confirmedMetric)
	});
}

export function buildAnalyticsRows<TItem extends AnalyticsEntityItem & { isActive: boolean }>(
	args: BuildAnalyticsRowsRanking<TItem>
): UserAnalyticsRankingRow[];

export function buildAnalyticsRows<TItem extends AnalyticsEntityItem>(
	args: BuildAnalyticsRowsPerformance<TItem>
): UserAnalyticsPlaceDetailPerformanceRow<TItem['type']>[];

export function buildAnalyticsRows<TItem extends AnalyticsEntityItem>(
	args: BuildAnalyticsRowsRanking<TItem> | BuildAnalyticsRowsPerformance<TItem>
): UserAnalyticsRankingRow[] | UserAnalyticsPlaceDetailPerformanceRow[] {
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
				(first, second) => second.views - first.views || second.requests - first.requests
			);
	}

	return items.map((item) => {
		const requests = getAnalyticsMetricValue(args.requestTotals, item._id);
		const confirmed = getAnalyticsMetricValue(args.confirmedTotals, item._id);

		return {
			id: item._id,
			name: item.name,
			type: item.type,
			city: item.city,
			isActive: item.isActive ?? true,
			primaryMetricValue: getAnalyticsMetricValue(args.primaryTotals, item._id),
			...(args.secondaryTotals
				? {
						secondaryMetricValue: getAnalyticsMetricValue(args.secondaryTotals, item._id)
					}
				: {}),
			requests,
			confirmed
		};
	});
}
