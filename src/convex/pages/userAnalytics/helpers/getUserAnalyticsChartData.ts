// LIBRARIES
import { analytics } from '@/convex/analytics';

// UTILS
import { DAY_MS, startOfUtcDay } from '../utils/dateUtils';

// TYPES
import type { QueryCtx } from '@/convex/_generated/server';
import type { UserAnalyticsChartMetric, UserAnalyticsChartPoint } from '../types/userAnalyticsTypes';

const DEFAULT_CHART_DAYS = 30;

/**
 * Fetches a daily time series for a single owner-scoped analytics metric.
 * Delegates to the analytics library's `fetchTimeSeries` — no raw DB queries.
 */
export async function getUserAnalyticsChartData(
	ctx: QueryCtx,
	metric: UserAnalyticsChartMetric,
	userId: string,
	days = DEFAULT_CHART_DAYS
): Promise<UserAnalyticsChartPoint[]> {
	const todayStart = startOfUtcDay(Date.now());
	const from = todayStart - DAY_MS * (days - 1);

	const result = await analytics.fetchTimeSeries(ctx, {
		metric,
		from,
		to: todayStart,
		scope: { type: 'organization', id: userId },
		fill: true
	});

	return result.data.map((p) => ({
		date: p.date,
		value: (p as Record<string, number>)[metric] ?? 0
	}));
}
