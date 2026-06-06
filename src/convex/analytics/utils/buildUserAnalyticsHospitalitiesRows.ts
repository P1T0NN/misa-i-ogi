import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

import type { Doc } from '@/convex/_generated/dataModel';
import type { UserAnalyticsRankingRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

export function buildUserAnalyticsHospitalitiesRows(args: {
	hospitalities: Doc<'hospitalities'>[];
	guestViewTotals: Map<string, number>;
	guestActivationTotals: Map<string, number>;
	reservationTotals: Map<string, number>;
	confirmedTotals: Map<string, number>;
}): UserAnalyticsRankingRow[] {
	return sortAnalyticsItemsByMetric(
		args.hospitalities,
		args.guestViewTotals,
		args.reservationTotals
	).map((hospitality) => {
		const requests = getAnalyticsMetricValue(args.reservationTotals, hospitality._id);
		const confirmed = getAnalyticsMetricValue(args.confirmedTotals, hospitality._id);

		return {
			id: hospitality._id,
			name: hospitality.name,
			type: hospitality.type,
			city: hospitality.city,
			isActive: hospitality.isActive,
			primaryMetricValue: getAnalyticsMetricValue(args.guestViewTotals, hospitality._id),
			secondaryMetricValue: getAnalyticsMetricValue(args.guestActivationTotals, hospitality._id),
			requests,
			confirmed
		};
	});
}
