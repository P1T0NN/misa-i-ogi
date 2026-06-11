// UTILS
import { getPresenceAnalyticsLabel } from './analyticsLabelUtils';
import { formatAnalyticsCount } from './analyticsDisplayFormattersUtils';

// TYPES
import type {
	UserAnalyticsComparedMetricSummary,
	UserAnalyticsStaticMetricSummary
} from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
import type { AnalyticsMetric } from '../types/analyticsTypes';
import type { typesAnalyticsMetricLabel } from '@piton-/analytics-convex';

export function createStaticAnalyticsMetric({
	id,
	label,
	metric,
	analyticsLabel
}: {
	id: string;
	label: string;
	metric: UserAnalyticsStaticMetricSummary;
	analyticsLabel: typesAnalyticsMetricLabel;
}): AnalyticsMetric {
	return {
		id,
		label,
		value: formatAnalyticsCount(metric.value),
		analyticsLabel
	};
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
		analyticsLabel: getPresenceAnalyticsLabel(metric.value)
	};
}
