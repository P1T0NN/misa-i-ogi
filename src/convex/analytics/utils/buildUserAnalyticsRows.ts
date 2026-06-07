// UTILS
import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

// TYPES
import type { UserAnalyticsRankingRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

type UserAnalyticsRankingItem = {
	_id: string;
	name: string;
	type: string;
	city: string;
	isActive: boolean;
};

export function buildUserAnalyticsRows<TItem extends UserAnalyticsRankingItem>(args: {
	items: TItem[];
	primaryMetricTotals: Map<string, number>;
	secondaryMetricTotals?: Map<string, number>;
	requestTotals: Map<string, number>;
	confirmedTotals: Map<string, number>;
}): UserAnalyticsRankingRow[] {
	return sortAnalyticsItemsByMetric(args.items, args.primaryMetricTotals, args.requestTotals).map(
		(item) => {
			const requests = getAnalyticsMetricValue(args.requestTotals, item._id);
			const confirmed = getAnalyticsMetricValue(args.confirmedTotals, item._id);

			return {
				id: item._id,
				name: item.name,
				type: item.type,
				city: item.city,
				isActive: item.isActive,
				primaryMetricValue: getAnalyticsMetricValue(args.primaryMetricTotals, item._id),
				...(args.secondaryMetricTotals
					? {
							secondaryMetricValue: getAnalyticsMetricValue(args.secondaryMetricTotals, item._id)
						}
					: {}),
				requests,
				confirmed
			};
		}
	);
}
