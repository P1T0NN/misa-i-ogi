import type {
	typesMetricComparisonInput,
	typesMetricEvaluationResult
} from '@piton-/analytics-convex';

import type { AccommodationType } from '@/convex/tables/accommodations/types/accommodationsTypes';
import type { HospitalityType } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

export type UserAnalyticsChartPoint = {
	/** UTC day start timestamp (bucketStart from analyticsDailyMetrics). */
	date: number;
	value: number;
};

export type UserAnalyticsChartMetric = 'qrScans' | 'guestActivations' | 'newReservations';

export type UserAnalyticsStaticMetricSummary = {
	value: number;
};

export type UserAnalyticsComparedMetricSummary = UserAnalyticsStaticMetricSummary & {
	comparison: typesMetricComparisonInput;
	evaluation?: typesMetricEvaluationResult;
};

export type UserAnalyticsBarChartRow = {
	id: string;
	name: string;
	value: number;
};

type UserAnalyticsEntityTableRowBase = {
	id: string;
	name: string;
	type: string;
	city: string;
	isActive: boolean;
	reservations: number;
	confirmed: number;
};

export type UserAnalyticsAccommodationTableRow = UserAnalyticsEntityTableRowBase & {
	scans: number;
	guestActivations: number;
};

export type UserAnalyticsHospitalityTableRow = UserAnalyticsEntityTableRowBase & {
	guestViews: number;
};

export type UserAnalyticsOverviewPageResult = {
	qrScansChart: UserAnalyticsChartPoint[];
	guestActivationsChart: UserAnalyticsChartPoint[];
	reservationsChart: UserAnalyticsChartPoint[];
	topAccommodations: UserAnalyticsAccommodationTableRow[];
	topHospitalities: UserAnalyticsHospitalityTableRow[];
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
	rows: UserAnalyticsAccommodationTableRow[];
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
	rows: UserAnalyticsHospitalityTableRow[];
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
