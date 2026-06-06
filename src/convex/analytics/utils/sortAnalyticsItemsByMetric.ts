// UTILS
import { getAnalyticsMetricValue } from './getAnalyticsMetricValue';

type AnalyticsSortableItem = {
	_id: string;
	name: string;
};

export function sortAnalyticsItemsByMetric<T extends AnalyticsSortableItem>(
	items: T[],
	totals: Map<string, number>,
	tieBreakerTotals?: Map<string, number>
) {
	return [...items].sort((a, b) => {
		const metricDelta = getAnalyticsMetricValue(totals, b._id) - getAnalyticsMetricValue(totals, a._id);
		if (metricDelta !== 0) return metricDelta;

		const tieBreakerDelta =
			(tieBreakerTotals ? getAnalyticsMetricValue(tieBreakerTotals, b._id) : 0) -
			(tieBreakerTotals ? getAnalyticsMetricValue(tieBreakerTotals, a._id) : 0);
		if (tieBreakerDelta !== 0) return tieBreakerDelta;

		return a.name.localeCompare(b.name);
	});
}
