// LIBRARIES
import type {
	typesDashboardMetricItem,
	typesMetricComparisonInput
} from '@piton-/analytics-convex';

// TYPES
import type { UserAnalyticsComparedMetricSummary } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

export function emptyMetricComparison(): typesMetricComparisonInput {
	return {
		current: 0,
		previous: 0,
		delta: 0,
		deltaPercent: 0
	};
}

export function toComparedMetric(
	item: typesDashboardMetricItem
): UserAnalyticsComparedMetricSummary {
	return toComparedMetricWithValue(item, item.value);
}

export function toComparedMetricWithValue(
	item: typesDashboardMetricItem,
	value: number
): UserAnalyticsComparedMetricSummary {
	return {
		value,
		comparison: item.comparison ?? emptyMetricComparison(),
		evaluation: item.evaluation
	};
}
