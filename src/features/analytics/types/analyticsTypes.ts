export type AnalyticsMetricTone = 'positive' | 'warning' | 'neutral';

export type AnalyticsMetric = {
	id: string;
	label: string;
	value: string;
	trend: string;
	tone: AnalyticsMetricTone;
};
