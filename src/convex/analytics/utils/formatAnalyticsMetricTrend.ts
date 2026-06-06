export type AnalyticsMetricTrendTone = 'positive' | 'warning' | 'neutral';

export type AnalyticsMetricComparison = {
	current: number;
	previous: number;
	delta: number;
	deltaPercent?: number;
};

export function formatAnalyticsMetricTrend(comparison: AnalyticsMetricComparison): {
	trend: string;
	tone: AnalyticsMetricTrendTone;
} {
	if (comparison.previous === 0) {
		if (comparison.current > 0) return { trend: 'New activity', tone: 'positive' };
		return { trend: 'No change', tone: 'neutral' };
	}

	const roundedDeltaPercent = Math.round(comparison.deltaPercent ?? 0);
	if (roundedDeltaPercent > 0) return { trend: `+${roundedDeltaPercent}%`, tone: 'positive' };
	if (roundedDeltaPercent < 0) return { trend: `${roundedDeltaPercent}%`, tone: 'warning' };

	return { trend: '0%', tone: 'neutral' };
}
