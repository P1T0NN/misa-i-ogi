import type { AccommodationType } from '@/convex/tables/accommodations/types/accommodationsTypes';
import type { HospitalityType } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

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

export type UserAnalyticsOverviewPageResult = {
	qrScansChart: UserAnalyticsChartPoint[];
	guestActivationsChart: UserAnalyticsChartPoint[];
	reservationsChart: UserAnalyticsChartPoint[];
	topAccommodations: UserAnalyticsRankingRow[];
	topHospitalities: UserAnalyticsRankingRow[];
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
	hospitalityViews: UserAnalyticsComparedMetricSummary;
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
	trackedVenues: UserAnalyticsStaticMetricSummary;
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

export type UserAnalyticsPlaceDetailPerformanceRow<EntityType extends string = string> = {
	id: string;
	name: string;
	type: EntityType;
	city: string;
	views: number;
	requests: number;
	confirmed: number;
};

export type UserAnalyticsAccommodationDetailResult = {
	accommodation: {
		id: string;
		name: string;
		type: AccommodationType;
		city: string;
	};
	metrics: UserAnalyticsAccommodationsPageMetrics;
	activityData: { date: number; qrScans: number; guestActivations: number; reservations: number }[];
	performance: { rows: UserAnalyticsPlaceDetailPerformanceRow<HospitalityType>[] };
};

export type UserAnalyticsHospitalityDetailResult = {
	hospitality: {
		id: string;
		name: string;
		type: HospitalityType;
		city: string;
	};
	metrics: UserAnalyticsHospitalitiesPageMetrics;
	activityData: { date: number; qrScans: number; guestActivations: number; reservations: number }[];
	performance: { rows: UserAnalyticsPlaceDetailPerformanceRow<AccommodationType>[] };
};
