// LIBRARIES
import { evaluateMetricLabel, type typesAnalyticsMetricLabel } from '@piton-/analytics-convex';

export function getPresenceAnalyticsLabel(value: number): typesAnalyticsMetricLabel {
	return evaluateMetricLabel({
		kind: 'comparison',
		comparison: {
			current: value,
			previous: 0,
			delta: value
		},
		config: {
			kind: 'comparison',
			excellentGrowthPercent: Number.MAX_SAFE_INTEGER,
			goodGrowthPercent: 1,
			badGrowthPercent: -1
		}
	}).label;
}
