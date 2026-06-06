import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

import type { Doc } from '@/convex/_generated/dataModel';
import type { UserAnalyticsBarChartRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

export function buildUserAnalyticsAccommodationChartData(args: {
	accommodations: Doc<'accommodations'>[];
	reservationTotals: Map<string, number>;
	qrScanTotals: Map<string, number>;
	limit?: number;
}): UserAnalyticsBarChartRow[] {
	return sortAnalyticsItemsByMetric(args.accommodations, args.reservationTotals, args.qrScanTotals)
		.map((accommodation) => ({
			id: accommodation._id,
			name: accommodation.name,
			value: getAnalyticsMetricValue(args.reservationTotals, accommodation._id)
		}))
		.slice(0, args.limit ?? Infinity);
}
