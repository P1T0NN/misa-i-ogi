// TYPES
import type { typesAnalyticsMetricLabel } from '@piton-/analytics-convex';

export type AnalyticsMetric = {
	id: string;
	label: string;
	value: string;
	analyticsLabel?: typesAnalyticsMetricLabel;
};

export type AnalyticsTopTableVariant = 'top' | 'performance' | 'admin';
