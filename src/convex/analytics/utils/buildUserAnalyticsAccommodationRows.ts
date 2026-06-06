import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';
import { sortAnalyticsItemsByMetric } from './sortAnalyticsItemsByMetric';

import type { Doc } from '@/convex/_generated/dataModel';
import type { UserAnalyticsRankingRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

export function buildUserAnalyticsAccommodationRows(args: {
	accommodations: Doc<'accommodations'>[];
	qrScanTotals: Map<string, number>;
	guestActivationTotals: Map<string, number>;
	reservationTotals: Map<string, number>;
	confirmedTotals: Map<string, number>;
}): UserAnalyticsRankingRow[] {
	return sortAnalyticsItemsByMetric(
		args.accommodations,
		args.qrScanTotals,
		args.reservationTotals
	).map((accommodation) => {
		const requests = getAnalyticsMetricValue(args.reservationTotals, accommodation._id);
		const confirmed = getAnalyticsMetricValue(args.confirmedTotals, accommodation._id);

		return {
			id: accommodation._id,
			name: accommodation.name,
			type: accommodation.type,
			city: accommodation.city,
			isActive: accommodation.isActive,
			primaryMetricValue: getAnalyticsMetricValue(args.qrScanTotals, accommodation._id),
			secondaryMetricValue: getAnalyticsMetricValue(args.guestActivationTotals, accommodation._id),
			requests,
			confirmed
		};
	});
}
