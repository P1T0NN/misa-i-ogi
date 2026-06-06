import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

import type { Doc } from '@/convex/_generated/dataModel';
import type { UserAnalyticsBarChartRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

export function buildUserAnalyticsHospitalitiesChartData(args: {
	hospitalities: Doc<'hospitalities'>[];
	reservationTotals: Map<string, number>;
	guestViewTotals: Map<string, number>;
	limit?: number;
}): UserAnalyticsBarChartRow[] {
	return sortAnalyticsItemsByMetric(args.hospitalities, args.reservationTotals, args.guestViewTotals)
		.map((hospitality) => ({
			id: hospitality._id,
			name: hospitality.name,
			value: getAnalyticsMetricValue(args.reservationTotals, hospitality._id)
		}))
		.slice(0, args.limit ?? Infinity);
}
