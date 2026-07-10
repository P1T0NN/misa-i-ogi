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

export type UserAnalyticsOverviewPageMetrics = {
	qrScans: UserAnalyticsComparedMetricSummary;
	guestActivations: UserAnalyticsComparedMetricSummary;
	requestsGenerated: UserAnalyticsComparedMetricSummary;
	confirmedReservations: UserAnalyticsComparedMetricSummary;
};

/** One merged daily point across the overview trend series. */
export type UserAnalyticsOverviewTrendPoint = {
	date: number;
	qrScans: number;
	guestActivations: number;
	reservations: number;
};

export type UserAnalyticsOverviewPageResult = {
	metrics: UserAnalyticsOverviewPageMetrics;
	trendChart: UserAnalyticsOverviewTrendPoint[];
	topAccommodations: UserAnalyticsAccommodationTableRow[];
	topHospitalities: UserAnalyticsHospitalityTableRow[];
};

export type UserAnalyticsAccommodationsPageMetrics = {
	qrScans: UserAnalyticsComparedMetricSummary;
	guestActivations: UserAnalyticsComparedMetricSummary;
	requestsGenerated: UserAnalyticsComparedMetricSummary;
	confirmedReservations: UserAnalyticsComparedMetricSummary;
};

export type UserAnalyticsAccommodationsPageResult = {
	metrics: UserAnalyticsAccommodationsPageMetrics;
	chart: {
		data: UserAnalyticsBarChartRow[];
	};
	rows: UserAnalyticsAccommodationTableRow[];
};

export type UserAnalyticsHospitalitiesPageMetrics = {
	hospitalityViews: UserAnalyticsComparedMetricSummary;
	guestActivations: UserAnalyticsComparedMetricSummary;
	requestsGenerated: UserAnalyticsComparedMetricSummary;
	confirmedReservations: UserAnalyticsComparedMetricSummary;
};

export type UserAnalyticsHospitalitiesPageResult = {
	metrics: UserAnalyticsHospitalitiesPageMetrics;
	chart: {
		data: UserAnalyticsBarChartRow[];
	};
	rows: UserAnalyticsHospitalityTableRow[];
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

export type UserAnalyticsPlaceDetailPerformanceRow<EntityType extends string = string> = {
	id: string;
	name: string;
	type: EntityType;
	city: string;
	views: number;
	requests: number;
	confirmed: number;
};

/** Accommodation detail shows the same funnel tiles as the accommodations list. */
export type UserAnalyticsAccommodationDetailMetrics = UserAnalyticsAccommodationsPageMetrics;

export type UserAnalyticsAccommodationDetailResult = {
	accommodation: {
		id: string;
		name: string;
		type: AccommodationType;
		city: string;
	};
	metrics: UserAnalyticsAccommodationDetailMetrics;
	performance: { rows: UserAnalyticsPlaceDetailPerformanceRow<HospitalityType>[] };
};

/** Hospitality detail has no guest-activation stage (activations happen at accommodations). */
export type UserAnalyticsHospitalityDetailMetrics = {
	hospitalityViews: UserAnalyticsComparedMetricSummary;
	requestsGenerated: UserAnalyticsComparedMetricSummary;
	confirmedReservations: UserAnalyticsComparedMetricSummary;
};

export type UserAnalyticsHospitalityDetailResult = {
	hospitality: {
		id: string;
		name: string;
		type: HospitalityType;
		city: string;
	};
	metrics: UserAnalyticsHospitalityDetailMetrics;
	performance: { rows: UserAnalyticsPlaceDetailPerformanceRow<AccommodationType>[] };
};
