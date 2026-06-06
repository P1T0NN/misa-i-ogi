export type UserAnalyticsChartPoint = {
	/** UTC day start timestamp (bucketStart from analyticsDailyMetrics). */
	date: number;
	value: number;
};

export type UserAnalyticsChartMetric = 'qrScans' | 'guestActivations' | 'newReservations';

export type UserAnalyticsMetricComparison = {
	current: number;
	previous: number;
	delta: number;
	deltaPercent?: number;
};

export type UserAnalyticsStaticMetricSummary = {
	value: number;
};

export type UserAnalyticsComparedMetricSummary = UserAnalyticsStaticMetricSummary & {
	comparison: UserAnalyticsMetricComparison;
};

export type UserAnalyticsBarChartRow = {
	id: string;
	name: string;
	value: number;
};

export type UserAnalyticsRankingRow = {
	id: string;
	name: string;
	type: string;
	city: string;
	isActive: boolean;
	primaryMetricValue: number;
	secondaryMetricValue?: number;
	requests: number;
	confirmed: number;
};

export type UserAnalyticsAccommodationsPageMetrics = {
	trackedStays: UserAnalyticsStaticMetricSummary;
	qrScans: UserAnalyticsComparedMetricSummary;
	guestActivations: UserAnalyticsComparedMetricSummary;
	requestsGenerated: UserAnalyticsComparedMetricSummary;
};

export type UserAnalyticsAccommodationsPageResult = {
	metrics: UserAnalyticsAccommodationsPageMetrics;
	chart: {
		data: UserAnalyticsBarChartRow[];
	};
	rows: UserAnalyticsRankingRow[];
};

export type UserAnalyticsHospitalitiesPageMetrics = {
	trackedVenues: UserAnalyticsStaticMetricSummary;
	guestViews: UserAnalyticsComparedMetricSummary;
	guestActivations: UserAnalyticsComparedMetricSummary;
	requestsGenerated: UserAnalyticsComparedMetricSummary;
};

export type UserAnalyticsHospitalitiesPageResult = {
	metrics: UserAnalyticsHospitalitiesPageMetrics;
	chart: {
		data: UserAnalyticsBarChartRow[];
	};
	rows: UserAnalyticsRankingRow[];
};

export type UserAnalyticsReservationsPageMetrics = {
	created: UserAnalyticsComparedMetricSummary;
	confirmed: UserAnalyticsComparedMetricSummary;
	cancelled: UserAnalyticsComparedMetricSummary;
};

export type UserAnalyticsReservationStatusChartPoint = {
	date: number;
	created: number;
	confirmed: number;
	cancelled: number;
};

export type UserAnalyticsReservationSourceRow = {
	id: string;
	name: string;
	created: number;
	confirmed: number;
	cancelled: number;
};

export type UserAnalyticsReservationsPageResult = {
	metrics: UserAnalyticsReservationsPageMetrics;
	statusChart: {
		data: UserAnalyticsReservationStatusChartPoint[];
	};
	rows: UserAnalyticsReservationSourceRow[];
};
