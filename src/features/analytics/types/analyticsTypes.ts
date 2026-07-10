// TYPES
import type { typesAnalyticsMetricLabel } from '@piton-/analytics-convex';

/** Real period-over-period change for a tile, derived from the backend comparison. */
export type AnalyticsMetricDelta = {
	/** Rounded percent change vs the previous window. Undefined when there was no prior activity. */
	deltaPercent?: number;
	direction: 'up' | 'down' | 'flat';
	/** Metric-aware sentiment from the backend (e.g. cancellations rising = negative). */
	sentiment: 'positive' | 'negative' | 'neutral';
};

export type AnalyticsMetric = {
	id: string;
	label: string;
	value: string;
	/** Categorical badge — used by static/admin tiles that have no comparison. */
	analyticsLabel?: typesAnalyticsMetricLabel;
	/** Real vs-previous-period delta — used by compared tiles instead of a badge. */
	delta?: AnalyticsMetricDelta;
};

export type AnalyticsTopTableVariant =
	| 'top'
	| 'performance'
	| 'detailPerformance'
	| 'admin'
	| 'dummy';
