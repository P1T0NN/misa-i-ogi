// UTILS
import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

// TYPES
import type { UserAnalyticsBarChartRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

type UserAnalyticsChartItem = {
	_id: string;
	name: string;
};

export function buildUserAnalyticsChartData<TItem extends UserAnalyticsChartItem>(args: {
	items: TItem[];
	valueTotals: Map<string, number>;
	tieBreakerTotals?: Map<string, number>;
	limit?: number;
}): UserAnalyticsBarChartRow[] {
	return sortAnalyticsItemsByMetric(args.items, args.valueTotals, args.tieBreakerTotals)
		.map((item) => ({
			id: item._id,
			name: item.name,
			value: getAnalyticsMetricValue(args.valueTotals, item._id)
		}))
		.slice(0, args.limit ?? Infinity);
}
