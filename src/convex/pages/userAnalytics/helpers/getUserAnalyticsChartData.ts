// LIBRARIES
import { createAnalyticsDayRange } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { ANALYTICS_QUERY_RANGE_DAYS } from '@/convex/analytics/analyticsConstants';

// TYPES
import type { QueryCtx } from '@/convex/_generated/server';
import type {
	UserAnalyticsChartMetric,
	UserAnalyticsChartPoint
} from '../types/userAnalyticsTypes';

/**
 * Fetches a daily time series for a single owner-scoped analytics metric.
 */
export async function getUserAnalyticsChartData(
	ctx: QueryCtx,
	metric: UserAnalyticsChartMetric,
	userId: string,
	days = ANALYTICS_QUERY_RANGE_DAYS
): Promise<UserAnalyticsChartPoint[]> {
	const { from, to } = createAnalyticsDayRange({ days, includeToday: true });

	const result = await analytics.fetchTimeSeries(ctx, {
		metric,
		from,
		to,
		scope: { type: 'organization', id: userId },
		fill: true
	});

	return result.data.map((p) => ({
		date: p.date,
		value: (p as Record<string, number>)[metric] ?? 0
	}));
}
