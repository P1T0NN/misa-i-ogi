// TYPES
import type { UserAnalyticsMetricComparison } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

export function createEmptyMetricComparison(): UserAnalyticsMetricComparison {
	return {
		current: 0,
		previous: 0,
		delta: 0,
		deltaPercent: 0
	};
}
