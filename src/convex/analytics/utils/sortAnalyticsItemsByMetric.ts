// LIBRARIES
import { compareScores } from '@piton-/analytics-convex';

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
		const metricDelta = compareScores(
			'desc',
			getAnalyticsMetricValue(totals, a._id),
			getAnalyticsMetricValue(totals, b._id)
		);
		if (metricDelta !== 0) return metricDelta;

		const tieBreakerDelta = compareScores(
			'desc',
			tieBreakerTotals ? getAnalyticsMetricValue(tieBreakerTotals, a._id) : 0,
			tieBreakerTotals ? getAnalyticsMetricValue(tieBreakerTotals, b._id) : 0
		);
		if (tieBreakerDelta !== 0) return tieBreakerDelta;

		return a.name.localeCompare(b.name);
	});
}
