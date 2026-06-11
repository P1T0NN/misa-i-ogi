// LIBRARIES
import { createAnalyticsDayRange } from '@piton-/analytics-convex';

// CONFIG
import { ANALYTICS_QUERY_RANGE_DAYS } from '@/convex/analytics/analyticsConstants';

/** Last N UTC days including today; matches dashboard chart windows. */
export function createAnalyticsQueryDayRange(days = ANALYTICS_QUERY_RANGE_DAYS) {
	return createAnalyticsDayRange({ days, includeToday: true });
}
