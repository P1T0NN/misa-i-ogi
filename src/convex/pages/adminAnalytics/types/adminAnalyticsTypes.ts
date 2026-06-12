// TYPES
import type { typesDashboardMetricItem } from '@piton-/analytics-convex';

export type AdminAnalyticsDashboardMetrics = {
	qrScans: typesDashboardMetricItem;
	guestActivations: typesDashboardMetricItem;
	hospitalityViews: typesDashboardMetricItem;
	newReservations: typesDashboardMetricItem;
	cancelledReservations: typesDashboardMetricItem;
};

export type AdminAnalyticsTrendPoint = {
	date: number;
	qrScans: number;
	guestActivations: number;
	hospitalityViews: number;
	newReservations: number;
	confirmedReservations: number;
};

export type AdminAnalyticsTopAccommodationRow = {
	id: string;
	name: string;
	type: string;
	city: string;
	scans: number;
	guestActivations: number;
	reservations: number;
	confirmed: number;
};

export type AdminAnalyticsTopHospitalityRow = {
	id: string;
	name: string;
	type: string;
	city: string;
	guestViews: number;
	reservations: number;
	confirmed: number;
};

export type AdminAnalyticsOverviewPageResult = {
	metrics: AdminAnalyticsDashboardMetrics;
	trend: AdminAnalyticsTrendPoint[];
	topAccommodations: AdminAnalyticsTopAccommodationRow[];
	topHospitalities: AdminAnalyticsTopHospitalityRow[];
};
