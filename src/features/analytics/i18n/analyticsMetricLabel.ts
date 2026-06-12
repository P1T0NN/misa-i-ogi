// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// TYPES
import type { typesAnalyticsMetricLabel } from '@piton-/analytics-convex';

const ANALYTICS_METRIC_LABEL_MESSAGES = {
	neutral: () => m['AnalyticsMetricLabels.neutral'](),
	activity: () => m['AnalyticsMetricLabels.activity'](),
	good: () => m['AnalyticsMetricLabels.good'](),
	excellent: () => m['AnalyticsMetricLabels.excellent'](),
	bad: () => m['AnalyticsMetricLabels.bad'](),
	clear: () => m['AnalyticsMetricLabels.clear']()
} satisfies Record<typesAnalyticsMetricLabel, () => string>;

/**
 * Localized Piton analytics metric badge labels.
 * Piton ships English defaults — product copy lives in `AnalyticsMetricLabels.*`.
 */
export function analyticsMetricLabel(label: typesAnalyticsMetricLabel): string {
	return ANALYTICS_METRIC_LABEL_MESSAGES[label]();
}
