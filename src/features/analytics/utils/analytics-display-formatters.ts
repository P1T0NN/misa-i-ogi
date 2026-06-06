// TYPES
import type {
	UserAnalyticsComparedMetricSummary,
	UserAnalyticsMetricComparison,
	UserAnalyticsStaticMetricSummary
} from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
import type {
	AnalyticsMetric,
	AnalyticsMetricTone
} from '@/features/analytics/types/analyticsTypes';

export function formatAnalyticsCount(value: number) {
	return value.toLocaleString('en-US');
}

export function formatAnalyticsConversionRate(requests: number, confirmed: number) {
	if (requests === 0) return '0%';
	return `${Math.round((confirmed / requests) * 100)}%`;
}

export function formatAnalyticsType(value: string) {
	return value.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatAnalyticsComparisonTrend(comparison: UserAnalyticsMetricComparison) {
	if (comparison.previous === 0) {
		if (comparison.current > 0) return 'New activity';
		return 'No change';
	}

	const roundedDeltaPercent = Math.round(comparison.deltaPercent ?? 0);
	if (roundedDeltaPercent > 0) return `+${roundedDeltaPercent}%`;
	if (roundedDeltaPercent < 0) return `${roundedDeltaPercent}%`;

	return '0%';
}

export function getAnalyticsComparisonTone(
	comparison: UserAnalyticsMetricComparison
): AnalyticsMetricTone {
	if (comparison.previous === 0) {
		if (comparison.current > 0) return 'positive';
		return 'neutral';
	}

	const roundedDeltaPercent = Math.round(comparison.deltaPercent ?? 0);
	if (roundedDeltaPercent > 0) return 'positive';
	if (roundedDeltaPercent < 0) return 'warning';

	return 'neutral';
}

export function createComparedAnalyticsMetric({
	id,
	label,
	metric
}: {
	id: string;
	label: string;
	metric: UserAnalyticsComparedMetricSummary;
}): AnalyticsMetric {
	return {
		id,
		label,
		value: formatAnalyticsCount(metric.value),
		trend: formatAnalyticsComparisonTrend(metric.comparison),
		tone: getAnalyticsComparisonTone(metric.comparison)
	};
}

export function createStaticAnalyticsMetric({
	id,
	label,
	metric,
	trend,
	tone
}: {
	id: string;
	label: string;
	metric: UserAnalyticsStaticMetricSummary;
	trend: string;
	tone: AnalyticsMetricTone;
}): AnalyticsMetric {
	return {
		id,
		label,
		value: formatAnalyticsCount(metric.value),
		trend,
		tone
	};
}
