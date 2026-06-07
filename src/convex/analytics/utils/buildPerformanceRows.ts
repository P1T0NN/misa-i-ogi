// UTILS
import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';

// TYPES
import type { UserAnalyticsPlaceDetailPerformanceRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

type AnalyticsPerformanceItem<EntityType extends string = string> = {
	_id: string;
	name: string;
	type: EntityType;
	city: string;
};

export function buildPerformanceRows<EntityType extends string>(args: {
	items: AnalyticsPerformanceItem<EntityType>[];
	viewTotals: Map<string, number>;
	requestTotals: Map<string, number>;
	confirmedTotals: Map<string, number>;
}): UserAnalyticsPlaceDetailPerformanceRow<EntityType>[] {
	return args.items
		.map((item) => {
			const views = getAnalyticsMetricValue(args.viewTotals, item._id);
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
		.sort((first, second) => second.views - first.views || second.requests - first.requests);
}
