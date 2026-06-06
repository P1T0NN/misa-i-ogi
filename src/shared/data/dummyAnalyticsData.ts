export type DummyAnalyticsActivityDatum = {
	date: Date;
	qrScans: number;
	guestActivations: number;
	reservations: number;
};

type DummyAnalyticsActivityRow = [
	date: string,
	qrScans: number,
	guestActivations: number,
	reservations: number
];

const dummyAnalyticsActivityRows: DummyAnalyticsActivityRow[] = [
	['2025-06-02', 49, 31, 9],
	['2025-06-03', 52, 34, 5],
	['2025-06-04', 54, 36, 6],
	['2025-06-05', 57, 39, 8],
	['2025-06-06', 60, 42, 9],
	['2025-06-07', 75, 53, 12],
	['2025-06-08', 78, 48, 8],
	['2025-06-09', 68, 43, 8],
	['2025-06-10', 71, 46, 9],
	['2025-06-11', 74, 49, 10],
	['2025-06-12', 50, 35, 9],
	['2025-06-13', 53, 38, 5],
	['2025-06-14', 67, 48, 8],
	['2025-06-15', 70, 43, 9],
	['2025-06-16', 61, 39, 9],
	['2025-06-17', 64, 42, 10],
	['2025-06-18', 66, 44, 7],
	['2025-06-19', 69, 47, 8],
	['2025-06-20', 72, 50, 9],
	['2025-06-21', 89, 61, 12],
	['2025-06-22', 92, 57, 13],
	['2025-06-23', 53, 34, 5],
	['2025-06-24', 56, 37, 7],
	['2025-06-25', 58, 39, 8],
	['2025-06-26', 61, 42, 9],
	['2025-06-27', 64, 45, 10],
	['2025-06-28', 79, 55, 8],
	['2025-06-29', 82, 51, 9],
	['2025-06-30', 71, 45, 9],
	['2025-07-01', 74, 48, 10],
	['2025-07-02', 76, 50, 12],
	['2025-07-03', 79, 53, 8],
	['2025-07-04', 55, 39, 7],
	['2025-07-05', 69, 49, 9],
	['2025-07-06', 72, 45, 10],
	['2025-07-07', 62, 39, 10],
	['2025-07-08', 65, 42, 7],
	['2025-07-09', 67, 45, 8],
	['2025-07-10', 69, 47, 9],
	['2025-07-11', 72, 50, 10],
	['2025-07-12', 89, 61, 13],
	['2025-07-13', 92, 57, 9],
	['2025-07-14', 79, 50, 9],
	['2025-07-15', 55, 36, 8],
	['2025-07-16', 57, 38, 9],
	['2025-07-17', 59, 41, 10],
	['2025-07-18', 62, 43, 6],
	['2025-07-19', 77, 54, 9],
	['2025-07-20', 79, 49, 10],
	['2025-07-21', 68, 43, 10],
	['2025-07-22', 70, 45, 11],
	['2025-07-23', 73, 48, 7],
	['2025-07-24', 75, 51, 9],
	['2025-07-25', 77, 53, 10],
	['2025-07-26', 63, 45, 9],
	['2025-07-27', 66, 41, 11],
	['2025-07-28', 57, 36, 6],
	['2025-07-29', 59, 39, 7],
	['2025-07-30', 61, 41, 8],
	['2025-07-31', 63, 43, 9],
	['2025-08-01', 65, 45, 11],
	['2025-08-02', 81, 56, 8],
	['2025-08-03', 84, 52, 9],
	['2025-08-04', 72, 46, 9],
	['2025-08-05', 74, 48, 10],
	['2025-08-06', 49, 33, 9],
	['2025-08-07', 51, 36, 5],
	['2025-08-08', 54, 38, 6],
	['2025-08-09', 67, 48, 9],
	['2025-08-10', 69, 43, 10],
	['2025-08-11', 60, 38, 10],
	['2025-08-12', 62, 40, 6],
	['2025-08-13', 64, 43, 7],
	['2025-08-14', 66, 45, 9],
	['2025-08-15', 68, 47, 10],
	['2025-08-16', 84, 58, 12],
	['2025-08-17', 54, 33, 5],
	['2025-08-18', 47, 30, 6],
	['2025-08-19', 49, 32, 7],
	['2025-08-20', 51, 35, 8],
	['2025-08-21', 54, 37, 9],
	['2025-08-22', 56, 40, 6],
	['2025-08-23', 69, 49, 8],
	['2025-08-24', 72, 45, 9],
	['2025-08-25', 62, 39, 9],
	['2025-08-26', 64, 42, 10],
	['2025-08-27', 66, 44, 7],
	['2025-08-28', 41, 29, 5],
	['2025-08-29', 44, 32, 6],
	['2025-08-30', 55, 40, 9],
	['2025-08-31', 57, 35, 10],
	['2025-09-01', 50, 32, 5],
	['2025-09-02', 52, 34, 6],
	['2025-09-03', 54, 36, 7],
	['2025-09-04', 56, 39, 9],
	['2025-09-05', 58, 41, 10],
	['2025-09-06', 73, 51, 7],
	['2025-09-07', 75, 47, 9],
	['2025-09-08', 39, 25, 6],
	['2025-09-09', 41, 27, 7],
	['2025-09-10', 43, 30, 8],
	['2025-09-11', 45, 32, 5],
	['2025-09-12', 47, 34, 6],
	['2025-09-13', 60, 43, 8],
	['2025-09-14', 62, 38, 9],
	['2025-09-15', 54, 34, 9],
	['2025-09-16', 56, 37, 6],
	['2025-09-17', 59, 40, 7],
	['2025-09-18', 61, 42, 8],
	['2025-09-19', 37, 28, 7],
	['2025-09-20', 47, 35, 9],
	['2025-09-21', 50, 31, 5],
	['2025-09-22', 44, 28, 5],
	['2025-09-23', 47, 31, 7],
	['2025-09-24', 49, 33, 8],
	['2025-09-25', 51, 36, 9],
	['2025-09-26', 54, 38, 5],
	['2025-09-27', 68, 48, 8],
	['2025-09-28', 71, 44, 9],
	['2025-09-29', 61, 39, 9],
	['2025-09-30', 37, 25, 8],
	['2025-10-01', 40, 28, 4],
	['2025-10-02', 43, 31, 5],
	['2025-10-03', 45, 33, 7],
	['2025-10-04', 57, 41, 9],
	['2025-10-05', 60, 37, 10],
	['2025-10-06', 53, 34, 5],
	['2025-10-07', 55, 36, 7],
	['2025-10-08', 58, 39, 8],
	['2025-10-09', 61, 42, 9],
	['2025-10-10', 63, 44, 10],
	['2025-10-11', 48, 36, 5],
	['2025-10-12', 51, 32, 6],
	['2025-10-13', 45, 29, 7],
	['2025-10-14', 48, 32, 8],
	['2025-10-15', 50, 34, 9],
	['2025-10-16', 53, 37, 5],
	['2025-10-17', 56, 40, 7],
	['2025-10-18', 70, 49, 9],
	['2025-10-19', 74, 46, 10],
	['2025-10-20', 64, 41, 10],
	['2025-10-21', 67, 44, 7],
	['2025-10-22', 43, 30, 5],
	['2025-10-23', 46, 33, 7],
	['2025-10-24', 49, 35, 8],
	['2025-10-25', 62, 44, 10],
	['2025-10-26', 65, 40, 7],
	['2025-10-27', 57, 36, 7],
	['2025-10-28', 60, 39, 8],
	['2025-10-29', 63, 42, 9],
	['2025-10-30', 65, 44, 11],
	['2025-10-31', 68, 47, 7],
	['2025-11-01', 85, 59, 10],
	['2025-11-02', 57, 35, 8],
	['2025-11-03', 50, 32, 8],
	['2025-11-04', 53, 35, 9],
	['2025-11-05', 56, 38, 6],
	['2025-11-06', 58, 40, 7],
	['2025-11-07', 61, 43, 8],
	['2025-11-08', 77, 54, 11],
	['2025-11-09', 80, 50, 12],
	['2025-11-10', 69, 44, 7],
	['2025-11-11', 72, 47, 8],
	['2025-11-12', 75, 50, 10],
	['2025-11-13', 51, 36, 8],
	['2025-11-14', 54, 38, 9],
	['2025-11-15', 68, 48, 7],
	['2025-11-16', 71, 44, 8],
	['2025-11-17', 62, 39, 8],
	['2025-11-18', 64, 42, 9],
	['2025-11-19', 67, 45, 11],
	['2025-11-20', 70, 47, 7],
	['2025-11-21', 72, 50, 8],
	['2025-11-22', 90, 62, 11],
	['2025-11-23', 93, 58, 12],
	['2025-11-24', 54, 34, 9],
	['2025-11-25', 56, 37, 6],
	['2025-11-26', 59, 40, 7],
	['2025-11-27', 62, 42, 8],
	['2025-11-28', 64, 45, 9],
	['2025-11-29', 80, 56, 12],
	['2025-11-30', 83, 51, 8],
	['2025-12-01', 72, 46, 8],
	['2025-12-02', 74, 48, 9],
	['2025-12-03', 77, 51, 11],
	['2025-12-04', 79, 53, 12],
	['2025-12-05', 55, 39, 6],
	['2025-12-06', 69, 49, 8],
	['2025-12-07', 72, 45, 9],
	['2025-12-08', 62, 39, 9],
	['2025-12-09', 65, 42, 11],
	['2025-12-10', 67, 45, 7],
	['2025-12-11', 69, 47, 8],
	['2025-12-12', 72, 50, 9],
	['2025-12-13', 89, 61, 12],
	['2025-12-14', 91, 56, 13],
	['2025-12-15', 78, 49, 8],
	['2025-12-16', 54, 35, 6],
	['2025-12-17', 57, 38, 8],
	['2025-12-18', 59, 41, 9],
	['2025-12-19', 61, 43, 10],
	['2025-12-20', 76, 53, 8],
	['2025-12-21', 78, 48, 9],
	['2025-12-22', 68, 43, 9],
	['2025-12-23', 70, 45, 10],
	['2025-12-24', 72, 48, 11],
	['2025-12-25', 74, 50, 7],
	['2025-12-26', 76, 52, 9],
	['2025-12-27', 62, 44, 8],
	['2025-12-28', 65, 40, 10],
	['2025-12-29', 56, 36, 10],
	['2025-12-30', 58, 38, 6],
	['2025-12-31', 60, 40, 7],
	['2026-01-01', 62, 42, 8],
	['2026-01-02', 64, 45, 9],
	['2026-01-03', 80, 56, 12],
	['2026-01-04', 82, 51, 8],
	['2026-01-05', 71, 45, 8],
	['2026-01-06', 73, 47, 9],
	['2026-01-07', 48, 33, 8],
	['2026-01-08', 50, 35, 9],
	['2026-01-09', 52, 37, 5],
	['2026-01-10', 65, 46, 8],
	['2026-01-11', 68, 42, 9],
	['2026-01-12', 58, 37, 9],
	['2026-01-13', 60, 39, 10],
	['2026-01-14', 62, 41, 6],
	['2026-01-15', 65, 44, 8],
	['2026-01-16', 67, 47, 9],
	['2026-01-17', 82, 57, 11],
	['2026-01-18', 53, 33, 9],
	['2026-01-19', 46, 30, 5],
	['2026-01-20', 48, 32, 6],
	['2026-01-21', 50, 34, 7],
	['2026-01-22', 52, 36, 8],
	['2026-01-23', 54, 38, 9],
	['2026-01-24', 68, 48, 7],
	['2026-01-25', 70, 43, 8],
	['2026-01-26', 61, 39, 8],
	['2026-01-27', 63, 41, 9],
	['2026-01-28', 65, 43, 11],
	['2026-01-29', 40, 29, 4],
	['2026-01-30', 43, 32, 5],
	['2026-01-31', 54, 39, 7],
	['2026-02-01', 56, 35, 9],
	['2026-02-02', 49, 31, 9],
	['2026-02-03', 51, 34, 5],
	['2026-02-04', 53, 36, 6],
	['2026-02-05', 55, 38, 8],
	['2026-02-06', 58, 41, 9],
	['2026-02-07', 72, 51, 11],
	['2026-02-08', 74, 46, 7],
	['2026-02-09', 38, 25, 5],
	['2026-02-10', 40, 27, 6],
	['2026-02-11', 42, 29, 7],
	['2026-02-12', 45, 32, 9],
	['2026-02-13', 47, 34, 5],
	['2026-02-14', 59, 43, 7],
	['2026-02-15', 62, 38, 8],
	['2026-02-16', 54, 34, 8],
	['2026-02-17', 56, 37, 10],
	['2026-02-18', 59, 40, 6],
	['2026-02-19', 61, 42, 7],
	['2026-02-20', 37, 28, 6],
	['2026-02-21', 47, 35, 8],
	['2026-02-22', 50, 31, 9],
	['2026-02-23', 44, 28, 4],
	['2026-02-24', 47, 31, 6],
	['2026-02-25', 49, 33, 7],
	['2026-02-26', 52, 36, 8],
	['2026-02-27', 54, 38, 9],
	['2026-02-28', 68, 48, 7],
	['2026-03-01', 71, 44, 8],
	['2026-03-02', 62, 39, 8],
	['2026-03-03', 38, 26, 7],
	['2026-03-04', 41, 28, 8],
	['2026-03-05', 43, 31, 4],
	['2026-03-06', 46, 34, 6],
	['2026-03-07', 58, 42, 8],
	['2026-03-08', 61, 38, 9],
	['2026-03-09', 54, 34, 9],
	['2026-03-10', 56, 37, 6],
	['2026-03-11', 59, 40, 7],
	['2026-03-12', 62, 42, 8],
	['2026-03-13', 64, 45, 9],
	['2026-03-14', 49, 36, 9],
	['2026-03-15', 52, 32, 5],
	['2026-03-16', 46, 30, 6],
	['2026-03-17', 49, 32, 7],
	['2026-03-18', 51, 35, 8],
	['2026-03-19', 54, 37, 9],
	['2026-03-20', 57, 40, 6],
	['2026-03-21', 72, 51, 8],
	['2026-03-22', 75, 47, 10],
	['2026-03-23', 65, 41, 10],
	['2026-03-24', 68, 44, 11],
	['2026-03-25', 44, 30, 4],
	['2026-03-26', 47, 33, 6],
	['2026-03-27', 50, 36, 7],
	['2026-03-28', 63, 45, 9],
	['2026-03-29', 66, 41, 11],
	['2026-03-30', 58, 37, 6],
	['2026-03-31', 61, 40, 7],
	['2026-04-01', 64, 43, 8],
	['2026-04-02', 66, 45, 10],
	['2026-04-03', 69, 48, 11],
	['2026-04-04', 86, 59, 9],
	['2026-04-05', 58, 36, 7],
	['2026-04-06', 51, 33, 7],
	['2026-04-07', 54, 35, 8],
	['2026-04-08', 57, 38, 10],
	['2026-04-09', 59, 41, 6],
	['2026-04-10', 62, 43, 7],
	['2026-04-11', 78, 54, 10],
	['2026-04-12', 81, 50, 11],
	['2026-04-13', 70, 44, 11],
	['2026-04-14', 73, 47, 7],
	['2026-04-15', 76, 50, 9],
	['2026-04-16', 52, 36, 7],
	['2026-04-17', 55, 39, 9],
	['2026-04-18', 69, 49, 11],
	['2026-04-19', 72, 45, 7],
	['2026-04-20', 63, 40, 7],
	['2026-04-21', 65, 42, 9],
	['2026-04-22', 68, 45, 10],
	['2026-04-23', 70, 47, 11],
	['2026-04-24', 73, 50, 7],
	['2026-04-25', 91, 62, 10],
	['2026-04-26', 94, 58, 11],
	['2026-04-27', 54, 34, 8],
	['2026-04-28', 57, 37, 10],
	['2026-04-29', 59, 40, 6],
	['2026-04-30', 62, 42, 7],
	['2026-05-01', 64, 45, 8],
	['2026-05-02', 80, 56, 11],
	['2026-05-03', 83, 51, 12],
	['2026-05-04', 72, 46, 7],
	['2026-05-05', 74, 48, 8],
	['2026-05-06', 77, 51, 10],
	['2026-05-07', 79, 53, 11],
	['2026-05-08', 55, 39, 10],
	['2026-05-09', 69, 49, 7],
	['2026-05-10', 72, 45, 8],
	['2026-05-11', 62, 39, 8],
	['2026-05-12', 64, 42, 9],
	['2026-05-13', 67, 45, 11],
	['2026-05-14', 69, 47, 7],
	['2026-05-15', 71, 49, 8],
	['2026-05-16', 88, 61, 11],
	['2026-05-17', 91, 56, 12],
	['2026-05-18', 78, 49, 12],
	['2026-05-19', 54, 35, 5],
	['2026-05-20', 56, 38, 7],
	['2026-05-21', 58, 40, 8],
	['2026-05-22', 60, 42, 9],
	['2026-05-23', 75, 53, 12],
	['2026-05-24', 78, 48, 8],
	['2026-05-25', 67, 43, 8],
	['2026-05-26', 69, 45, 9],
	['2026-05-27', 71, 47, 10],
	['2026-05-28', 73, 49, 11],
	['2026-05-29', 75, 52, 8],
	['2026-05-30', 61, 44, 7],
	['2026-05-31', 64, 40, 8],
	['2026-06-01', 55, 35, 9],
	['2026-06-02', 57, 37, 10]
];

export const dummyAnalyticsActivityData: DummyAnalyticsActivityDatum[] =
	dummyAnalyticsActivityRows.map(([date, qrScans, guestActivations, reservations]) => ({
		date: new Date(date),
		qrScans,
		guestActivations,
		reservations
	}));

export type DummyAnalyticsMetricTone = 'positive' | 'neutral' | 'warning';

export type DummyAnalyticsMetric = {
	id: string;
	label: string;
	value: string;
	detail: string;
	trend: string;
	tone: DummyAnalyticsMetricTone;
};

export type DummyAnalyticsChartDatum = {
	name: string;
	value: number;
	color: string;
};

export type DummyUserAnalyticsPlaceKind = 'accommodation' | 'hospitality';

export type DummyUserAnalyticsPlaceRow = {
	id: string;
	name: string;
	type: string;
	city: string;
	isActive: boolean;
	primaryMetric: string;
	secondaryMetric: string;
	requests: number;
	confirmed: number;
	conversionRate: string;
	topConnection: string;
	href: string;
};

export type DummyUserAnalyticsAttentionItem = {
	id: string;
	detail: string;
	badge: string;
	tone: DummyAnalyticsMetricTone;
	href: string;
};

export type DummyUserAnalyticsFunnelStep = {
	id: string;
	label: string;
	value: string;
	detail: string;
	progress: number;
};

export type DummyUserAnalyticsPerformanceRow = {
	id: string;
	name: string;
	type: string;
	city: string;
	views: number;
	requests: number;
	confirmed: number;
	conversionRate: string;
};

export type DummyUserAnalyticsComparisonPage = {
	metrics: DummyAnalyticsMetric[];
	chart: {
		data: DummyAnalyticsChartDatum[];
	};
	table: {
		rows: DummyUserAnalyticsPlaceRow[];
	};
};

export type DummyUserAnalyticsPlaceDetail = {
	id: string;
	title: string;
	badge: string;
	metrics: DummyAnalyticsMetric[];
	activityData: DummyAnalyticsActivityDatum[];
	funnel: DummyUserAnalyticsFunnelStep[];
	performance: {
		rows: DummyUserAnalyticsPerformanceRow[];
	};
};

export type DummyUserAnalyticsOverviewPage = {
	metrics: DummyAnalyticsMetric[];
	attentionItems: DummyUserAnalyticsAttentionItem[];
	topAccommodations: DummyUserAnalyticsPlaceRow[];
	topHospitalities: DummyUserAnalyticsPlaceRow[];
};

export type DummyUserAnalyticsReservationsPage = {
	metrics: DummyAnalyticsMetric[];
	statusChart: {
		data: DummyAnalyticsChartDatum[];
	};
	table: {
		rows: Array<{
			id: string;
			name: string;
			detail: string;
			created: number;
			confirmed: number;
			pending: number;
			cancelled: number;
			conversionRate: string;
		}>;
	};
};

function scaleActivityData({
	qrScans,
	guestActivations,
	reservations
}: {
	qrScans: number;
	guestActivations: number;
	reservations: number;
}): DummyAnalyticsActivityDatum[] {
	return dummyAnalyticsActivityData.map((item) => ({
		date: item.date,
		qrScans: Math.max(0, Math.round(item.qrScans * qrScans)),
		guestActivations: Math.max(0, Math.round(item.guestActivations * guestActivations)),
		reservations: Math.max(0, Math.round(item.reservations * reservations))
	}));
}

export const dummyUserAnalyticsOverview: DummyUserAnalyticsOverviewPage = {
	metrics: [
		{
			id: 'qr-scans',
			label: 'QR scans',
			value: '1,204',
			detail: 'Guests scanning connected stays',
			trend: '+18%',
			tone: 'positive'
		},
		{
			id: 'active-guests',
			label: 'Guest activations',
			value: '382',
			detail: 'Guests with active stay access',
			trend: '+12%',
			tone: 'positive'
		},
		{
			id: 'reservation-requests',
			label: 'Requests',
			value: '96',
			detail: 'Reservation requests created',
			trend: '+14%',
			tone: 'positive'
		},
		{
			id: 'confirmed-reservations',
			label: 'Confirmed',
			value: '71',
			detail: 'Requests accepted by partners',
			trend: '74%',
			tone: 'neutral'
		}
	] satisfies DummyAnalyticsMetric[],
	attentionItems: [
		{
			id: 'pending-requests',
			detail: 'Most are for weekend tour and dinner slots.',
			badge: 'Pending',
			tone: 'warning',
			href: '/analytics/reservations'
		},
		{
			id: 'quiet-stays',
			detail: 'Check QR placement or printed card visibility.',
			badge: 'Review',
			tone: 'warning',
			href: '/analytics/accommodations'
		},
		{
			id: 'top-link',
			detail: 'This pairing created 18 reservation requests.',
			badge: 'Strong',
			tone: 'positive',
			href: '/analytics/accommodations/dorcol-loft-14'
		}
	] satisfies DummyUserAnalyticsAttentionItem[],
	topAccommodations: [
		{
			id: 'dorcol-loft-14',
			name: 'Dorchol Loft 14',
			type: 'apartment',
			city: 'Belgrade',
			isActive: true,
			primaryMetric: '124 scans',
			secondaryMetric: '42 guest activations',
			requests: 28,
			confirmed: 22,
			conversionRate: '18%',
			topConnection: 'Mala Basta',
			href: '/analytics/accommodations/dorcol-loft-14'
		},
		{
			id: 'skadarlija-studio',
			name: 'Skadarlija Studio',
			type: 'apartment',
			city: 'Belgrade',
			isActive: true,
			primaryMetric: '96 scans',
			secondaryMetric: '31 guest activations',
			requests: 19,
			confirmed: 15,
			conversionRate: '16%',
			topConnection: 'Kafa Kod Luke',
			href: '/analytics/accommodations/skadarlija-studio'
		}
	] satisfies DummyUserAnalyticsPlaceRow[],
	topHospitalities: [
		{
			id: 'mala-basta',
			name: 'Mala Basta',
			type: 'restaurant',
			city: 'Belgrade',
			isActive: true,
			primaryMetric: '218 views',
			secondaryMetric: '32 requests',
			requests: 32,
			confirmed: 26,
			conversionRate: '15%',
			topConnection: 'Dorchol Loft 14',
			href: '/analytics/hospitalities/mala-basta'
		},
		{
			id: 'kafa-kod-luke',
			name: 'Kafa Kod Luke',
			type: 'cafe',
			city: 'Belgrade',
			isActive: true,
			primaryMetric: '164 views',
			secondaryMetric: '21 requests',
			requests: 21,
			confirmed: 17,
			conversionRate: '13%',
			topConnection: 'Skadarlija Studio',
			href: '/analytics/hospitalities/kafa-kod-luke'
		}
	] satisfies DummyUserAnalyticsPlaceRow[]
};

export const dummyUserAnalyticsAccommodationPage: DummyUserAnalyticsComparisonPage = {
	metrics: [
		{
			id: 'owned-stays',
			label: 'Tracked stays',
			value: '5',
			detail: 'Accommodations connected to analytics',
			trend: 'Live',
			tone: 'neutral'
		},
		{
			id: 'qr-scans',
			label: 'QR scans',
			value: '401',
			detail: 'Check-in scans from owned stays',
			trend: '+16%',
			tone: 'positive'
		},
		{
			id: 'active-guests',
			label: 'Guest activations',
			value: '132',
			detail: 'Guests currently using stay access',
			trend: '+9%',
			tone: 'positive'
		},
		{
			id: 'requests-generated',
			label: 'Requests generated',
			value: '74',
			detail: 'Reservations created from owned stays',
			trend: '+11%',
			tone: 'positive'
		}
	],
	chart: {
		data: [
			{ name: 'Dorchol Loft', value: 28, color: 'var(--chart-1)' },
			{ name: 'Skadarlija', value: 19, color: 'var(--chart-2)' },
			{ name: 'Savamala', value: 14, color: 'var(--chart-3)' },
			{ name: 'Vracar Suite', value: 9, color: 'var(--chart-4)' },
			{ name: 'Kalemegdan', value: 4, color: 'var(--chart-5)' }
		]
	},
	table: {
		rows: [
			{
				id: 'dorcol-loft-14',
				name: 'Dorchol Loft 14',
				type: 'apartment',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '124',
				secondaryMetric: '42',
				requests: 28,
				confirmed: 22,
				conversionRate: '18%',
				topConnection: 'Mala Basta',
				href: '/analytics/accommodations/dorcol-loft-14'
			},
			{
				id: 'skadarlija-studio',
				name: 'Skadarlija Studio',
				type: 'apartment',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '96',
				secondaryMetric: '31',
				requests: 19,
				confirmed: 15,
				conversionRate: '16%',
				topConnection: 'Kafa Kod Luke',
				href: '/analytics/accommodations/skadarlija-studio'
			},
			{
				id: 'savamala-rooms',
				name: 'Savamala Rooms',
				type: 'hostel',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '78',
				secondaryMetric: '26',
				requests: 14,
				confirmed: 11,
				conversionRate: '14%',
				topConnection: 'Kalemegdan Walks',
				href: '/analytics/accommodations/savamala-rooms'
			},
			{
				id: 'vracar-suite',
				name: 'Vracar Suite',
				type: 'apartment',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '62',
				secondaryMetric: '21',
				requests: 9,
				confirmed: 7,
				conversionRate: '11%',
				topConnection: 'Spa Centar',
				href: '/analytics/accommodations/vracar-suite'
			},
			{
				id: 'kalemegdan-flat',
				name: 'Kalemegdan Flat',
				type: 'apartment',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '41',
				secondaryMetric: '13',
				requests: 4,
				confirmed: 3,
				conversionRate: '7%',
				topConnection: 'Wine Room',
				href: '/analytics/accommodations/kalemegdan-flat'
			}
		]
	}
};

export const dummyUserAnalyticsHospitalityPage: DummyUserAnalyticsComparisonPage = {
	metrics: [
		{
			id: 'tracked-hospitalities',
			label: 'Tracked hospitalities',
			value: '5',
			detail: 'Venues connected to stay traffic',
			trend: 'Live',
			tone: 'neutral'
		},
		{
			id: 'guest-views',
			label: 'Guest views',
			value: '632',
			detail: 'Venue opens from stay pages',
			trend: '+9%',
			tone: 'positive'
		},
		{
			id: 'requests',
			label: 'Requests',
			value: '96',
			detail: 'Reservation requests created',
			trend: '+14%',
			tone: 'positive'
		},
		{
			id: 'confirmed',
			label: 'Confirmed',
			value: '71',
			detail: 'Accepted reservation requests',
			trend: '74%',
			tone: 'neutral'
		}
	],
	chart: {
		data: [
			{ name: 'Mala Basta', value: 32, color: 'var(--chart-1)' },
			{ name: 'Kafa Kod Luke', value: 21, color: 'var(--chart-2)' },
			{ name: 'Kalemegdan Walks', value: 17, color: 'var(--chart-3)' },
			{ name: 'Spa Centar', value: 14, color: 'var(--chart-4)' },
			{ name: 'Wine Room', value: 8, color: 'var(--chart-5)' }
		]
	},
	table: {
		rows: [
			{
				id: 'mala-basta',
				name: 'Mala Basta',
				type: 'restaurant',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '218',
				secondaryMetric: 'Dorchol Loft 14',
				requests: 32,
				confirmed: 26,
				conversionRate: '15%',
				topConnection: 'Dorchol Loft 14',
				href: '/analytics/hospitalities/mala-basta'
			},
			{
				id: 'kafa-kod-luke',
				name: 'Kafa Kod Luke',
				type: 'cafe',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '164',
				secondaryMetric: 'Skadarlija Studio',
				requests: 21,
				confirmed: 17,
				conversionRate: '13%',
				topConnection: 'Skadarlija Studio',
				href: '/analytics/hospitalities/kafa-kod-luke'
			},
			{
				id: 'kalemegdan-walks',
				name: 'Kalemegdan Walks',
				type: 'tour',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '126',
				secondaryMetric: 'Savamala Rooms',
				requests: 17,
				confirmed: 11,
				conversionRate: '13%',
				topConnection: 'Savamala Rooms',
				href: '/analytics/hospitalities/kalemegdan-walks'
			},
			{
				id: 'spa-centar',
				name: 'Spa Centar',
				type: 'spa',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '89',
				secondaryMetric: 'Vracar Suite',
				requests: 14,
				confirmed: 10,
				conversionRate: '16%',
				topConnection: 'Vracar Suite',
				href: '/analytics/hospitalities/spa-centar'
			},
			{
				id: 'wine-room',
				name: 'Wine Room',
				type: 'bar',
				city: 'Belgrade',
				isActive: true,
				primaryMetric: '35',
				secondaryMetric: 'Kalemegdan Flat',
				requests: 8,
				confirmed: 7,
				conversionRate: '23%',
				topConnection: 'Kalemegdan Flat',
				href: '/analytics/hospitalities/wine-room'
			}
		]
	}
};

export const dummyUserAnalyticsAccommodationDetails: Record<string, DummyUserAnalyticsPlaceDetail> =
	{
		'dorcol-loft-14': {
			id: 'dorcol-loft-14',
			title: 'Dorchol Loft 14',
			badge: 'Apartment',
			metrics: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '124',
					detail: 'Guest check-in scans',
					trend: '+18%',
					tone: 'positive'
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '42',
					detail: 'Guests with active access',
					trend: '+10%',
					tone: 'positive'
				},
				{
					id: 'venue-views',
					label: 'Venue views',
					value: '218',
					detail: 'Hospitality opens from this stay',
					trend: '+11%',
					tone: 'positive'
				},
				{
					id: 'requests',
					label: 'Requests',
					value: '28',
					detail: 'Reservations generated',
					trend: '18%',
					tone: 'neutral'
				}
			],
			activityData: scaleActivityData({ qrScans: 1.2, guestActivations: 1.05, reservations: 1.15 }),
			funnel: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '124',
					detail: 'Guests reached the stay page',
					progress: 100
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '42',
					detail: 'Guests kept access open',
					progress: 34
				},
				{
					id: 'venue-views',
					label: 'Hospitality views',
					value: '218',
					detail: 'Partner venues opened',
					progress: 72
				},
				{
					id: 'requests',
					label: 'Reservation requests',
					value: '28',
					detail: 'Requests created',
					progress: 23
				},
				{
					id: 'confirmed',
					label: 'Confirmed',
					value: '22',
					detail: 'Accepted by partners',
					progress: 18
				}
			],
			performance: {
				rows: [
					{
						id: 'mala-basta',
						name: 'Mala Basta',
						type: 'restaurant',
						city: 'Belgrade',
						views: 104,
						requests: 18,
						confirmed: 15,
						conversionRate: '17%'
					},
					{
						id: 'kafa-kod-luke',
						name: 'Kafa Kod Luke',
						type: 'cafe',
						city: 'Belgrade',
						views: 61,
						requests: 7,
						confirmed: 5,
						conversionRate: '11%'
					},
					{
						id: 'kalemegdan-walks',
						name: 'Kalemegdan Walks',
						type: 'tour',
						city: 'Belgrade',
						views: 53,
						requests: 3,
						confirmed: 2,
						conversionRate: '6%'
					}
				]
			}
		},
		'skadarlija-studio': {
			id: 'skadarlija-studio',
			title: 'Skadarlija Studio',
			badge: 'Studio',
			metrics: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '96',
					detail: 'Guest check-in scans',
					trend: '+13%',
					tone: 'positive'
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '31',
					detail: 'Guests with active access',
					trend: '+7%',
					tone: 'positive'
				},
				{
					id: 'venue-views',
					label: 'Venue views',
					value: '164',
					detail: 'Hospitality opens from this stay',
					trend: '+6%',
					tone: 'positive'
				},
				{
					id: 'requests',
					label: 'Requests',
					value: '19',
					detail: 'Reservations generated',
					trend: '16%',
					tone: 'neutral'
				}
			],
			activityData: scaleActivityData({ qrScans: 0.95, guestActivations: 0.82, reservations: 0.85 }),
			funnel: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '96',
					detail: 'Guests reached the stay page',
					progress: 100
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '31',
					detail: 'Guests kept access open',
					progress: 32
				},
				{
					id: 'venue-views',
					label: 'Hospitality views',
					value: '164',
					detail: 'Partner venues opened',
					progress: 68
				},
				{
					id: 'requests',
					label: 'Reservation requests',
					value: '19',
					detail: 'Requests created',
					progress: 20
				},
				{
					id: 'confirmed',
					label: 'Confirmed',
					value: '15',
					detail: 'Accepted by partners',
					progress: 16
				}
			],
			performance: {
				rows: [
					{
						id: 'kafa-kod-luke',
						name: 'Kafa Kod Luke',
						type: 'cafe',
						city: 'Belgrade',
						views: 81,
						requests: 13,
						confirmed: 10,
						conversionRate: '16%'
					},
					{
						id: 'mala-basta',
						name: 'Mala Basta',
						type: 'restaurant',
						city: 'Belgrade',
						views: 43,
						requests: 4,
						confirmed: 3,
						conversionRate: '9%'
					},
					{
						id: 'wine-room',
						name: 'Wine Room',
						type: 'bar',
						city: 'Belgrade',
						views: 40,
						requests: 2,
						confirmed: 2,
						conversionRate: '5%'
					}
				]
			}
		},
		'savamala-rooms': {
			id: 'savamala-rooms',
			title: 'Savamala Rooms',
			badge: 'Rooms',
			metrics: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '78',
					detail: 'Guest check-in scans',
					trend: '+8%',
					tone: 'positive'
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '26',
					detail: 'Guests with active access',
					trend: '+4%',
					tone: 'positive'
				},
				{
					id: 'venue-views',
					label: 'Venue views',
					value: '126',
					detail: 'Hospitality opens from this stay',
					trend: '+5%',
					tone: 'positive'
				},
				{
					id: 'requests',
					label: 'Requests',
					value: '14',
					detail: 'Reservations generated',
					trend: '14%',
					tone: 'neutral'
				}
			],
			activityData: scaleActivityData({ qrScans: 0.78, guestActivations: 0.7, reservations: 0.65 }),
			funnel: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '78',
					detail: 'Guests reached the stay page',
					progress: 100
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '26',
					detail: 'Guests kept access open',
					progress: 33
				},
				{
					id: 'venue-views',
					label: 'Hospitality views',
					value: '126',
					detail: 'Partner venues opened',
					progress: 62
				},
				{
					id: 'requests',
					label: 'Reservation requests',
					value: '14',
					detail: 'Requests created',
					progress: 18
				},
				{
					id: 'confirmed',
					label: 'Confirmed',
					value: '11',
					detail: 'Accepted by partners',
					progress: 14
				}
			],
			performance: {
				rows: [
					{
						id: 'kalemegdan-walks',
						name: 'Kalemegdan Walks',
						type: 'tour',
						city: 'Belgrade',
						views: 64,
						requests: 11,
						confirmed: 8,
						conversionRate: '17%'
					},
					{
						id: 'mala-basta',
						name: 'Mala Basta',
						type: 'restaurant',
						city: 'Belgrade',
						views: 34,
						requests: 2,
						confirmed: 2,
						conversionRate: '6%'
					},
					{
						id: 'wine-room',
						name: 'Wine Room',
						type: 'bar',
						city: 'Belgrade',
						views: 28,
						requests: 1,
						confirmed: 1,
						conversionRate: '4%'
					}
				]
			}
		},
		'vracar-suite': {
			id: 'vracar-suite',
			title: 'Vracar Suite',
			badge: 'Suite',
			metrics: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '62',
					detail: 'Guest check-in scans',
					trend: '+5%',
					tone: 'positive'
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '21',
					detail: 'Guests with active access',
					trend: '+3%',
					tone: 'positive'
				},
				{
					id: 'venue-views',
					label: 'Venue views',
					value: '89',
					detail: 'Hospitality opens from this stay',
					trend: '+2%',
					tone: 'positive'
				},
				{
					id: 'requests',
					label: 'Requests',
					value: '9',
					detail: 'Reservations generated',
					trend: '11%',
					tone: 'neutral'
				}
			],
			activityData: scaleActivityData({ qrScans: 0.62, guestActivations: 0.56, reservations: 0.45 }),
			funnel: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '62',
					detail: 'Guests reached the stay page',
					progress: 100
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '21',
					detail: 'Guests kept access open',
					progress: 34
				},
				{
					id: 'venue-views',
					label: 'Hospitality views',
					value: '89',
					detail: 'Partner venues opened',
					progress: 57
				},
				{
					id: 'requests',
					label: 'Reservation requests',
					value: '9',
					detail: 'Requests created',
					progress: 15
				},
				{
					id: 'confirmed',
					label: 'Confirmed',
					value: '7',
					detail: 'Accepted by partners',
					progress: 11
				}
			],
			performance: {
				rows: [
					{
						id: 'spa-centar',
						name: 'Spa Centar',
						type: 'spa',
						city: 'Belgrade',
						views: 52,
						requests: 7,
						confirmed: 5,
						conversionRate: '13%'
					},
					{
						id: 'mala-basta',
						name: 'Mala Basta',
						type: 'restaurant',
						city: 'Belgrade',
						views: 21,
						requests: 1,
						confirmed: 1,
						conversionRate: '5%'
					},
					{
						id: 'wine-room',
						name: 'Wine Room',
						type: 'bar',
						city: 'Belgrade',
						views: 16,
						requests: 1,
						confirmed: 1,
						conversionRate: '6%'
					}
				]
			}
		},
		'kalemegdan-flat': {
			id: 'kalemegdan-flat',
			title: 'Kalemegdan Flat',
			badge: 'Flat',
			metrics: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '41',
					detail: 'Guest check-in scans',
					trend: 'Review',
					tone: 'warning'
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '13',
					detail: 'Guests with active access',
					trend: '-4%',
					tone: 'warning'
				},
				{
					id: 'venue-views',
					label: 'Venue views',
					value: '35',
					detail: 'Hospitality opens from this stay',
					trend: '-7%',
					tone: 'warning'
				},
				{
					id: 'requests',
					label: 'Requests',
					value: '4',
					detail: 'Reservations generated',
					trend: '7%',
					tone: 'neutral'
				}
			],
			activityData: scaleActivityData({ qrScans: 0.42, guestActivations: 0.35, reservations: 0.22 }),
			funnel: [
				{
					id: 'qr-scans',
					label: 'QR scans',
					value: '41',
					detail: 'Guests reached the stay page',
					progress: 100
				},
				{
					id: 'active-guests',
					label: 'Guest activations',
					value: '13',
					detail: 'Guests kept access open',
					progress: 32
				},
				{
					id: 'venue-views',
					label: 'Hospitality views',
					value: '35',
					detail: 'Partner venues opened',
					progress: 43
				},
				{
					id: 'requests',
					label: 'Reservation requests',
					value: '4',
					detail: 'Requests created',
					progress: 10
				},
				{
					id: 'confirmed',
					label: 'Confirmed',
					value: '3',
					detail: 'Accepted by partners',
					progress: 7
				}
			],
			performance: {
				rows: [
					{
						id: 'wine-room',
						name: 'Wine Room',
						type: 'bar',
						city: 'Belgrade',
						views: 20,
						requests: 3,
						confirmed: 3,
						conversionRate: '15%'
					},
					{
						id: 'kalemegdan-walks',
						name: 'Kalemegdan Walks',
						type: 'tour',
						city: 'Belgrade',
						views: 10,
						requests: 1,
						confirmed: 0,
						conversionRate: '10%'
					},
					{
						id: 'mala-basta',
						name: 'Mala Basta',
						type: 'restaurant',
						city: 'Belgrade',
						views: 5,
						requests: 0,
						confirmed: 0,
						conversionRate: '0%'
					}
				]
			}
		}
	};

export const dummyUserAnalyticsHospitalityDetails: Record<string, DummyUserAnalyticsPlaceDetail> = {
	'mala-basta': {
		id: 'mala-basta',
		title: 'Mala Basta',
		badge: 'Restaurant',
		metrics: [
			{
				id: 'views',
				label: 'Guest views',
				value: '218',
				detail: 'Venue opens from stays',
				trend: '+11%',
				tone: 'positive'
			},
			{
				id: 'requests',
				label: 'Requests',
				value: '32',
				detail: 'Reservations created',
				trend: '+14%',
				tone: 'positive'
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '26',
				detail: 'Accepted requests',
				trend: '81%',
				tone: 'positive'
			},
			{
				id: 'pending',
				label: 'Pending',
				value: '2',
				detail: 'Waiting for response',
				trend: 'Review',
				tone: 'warning'
			}
		],
		activityData: scaleActivityData({ qrScans: 0.8, guestActivations: 0.6, reservations: 1.2 }),
		funnel: [
			{
				id: 'views',
				label: 'Guest views',
				value: '218',
				detail: 'Guests opened this venue',
				progress: 100
			},
			{
				id: 'requests',
				label: 'Reservation requests',
				value: '32',
				detail: 'Guests requested a booking',
				progress: 15
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '26',
				detail: 'Requests accepted',
				progress: 12
			},
			{
				id: 'cancelled',
				label: 'Cancelled',
				value: '4',
				detail: 'Guest or venue cancellations',
				progress: 2
			}
		],
		performance: {
			rows: [
				{
					id: 'dorcol-loft-14',
					name: 'Dorchol Loft 14',
					type: 'apartment',
					city: 'Belgrade',
					views: 104,
					requests: 18,
					confirmed: 15,
					conversionRate: '17%'
				},
				{
					id: 'skadarlija-studio',
					name: 'Skadarlija Studio',
					type: 'apartment',
					city: 'Belgrade',
					views: 43,
					requests: 4,
					confirmed: 3,
					conversionRate: '9%'
				},
				{
					id: 'savamala-rooms',
					name: 'Savamala Rooms',
					type: 'hostel',
					city: 'Belgrade',
					views: 34,
					requests: 2,
					confirmed: 2,
					conversionRate: '6%'
				}
			]
		}
	},
	'kafa-kod-luke': {
		id: 'kafa-kod-luke',
		title: 'Kafa Kod Luke',
		badge: 'Cafe',
		metrics: [
			{
				id: 'views',
				label: 'Guest views',
				value: '164',
				detail: 'Venue opens from stays',
				trend: '+7%',
				tone: 'positive'
			},
			{
				id: 'requests',
				label: 'Requests',
				value: '21',
				detail: 'Reservations created',
				trend: '+10%',
				tone: 'positive'
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '17',
				detail: 'Accepted requests',
				trend: '81%',
				tone: 'positive'
			},
			{
				id: 'pending',
				label: 'Pending',
				value: '1',
				detail: 'Waiting for response',
				trend: 'Good',
				tone: 'neutral'
			}
		],
		activityData: scaleActivityData({ qrScans: 0.65, guestActivations: 0.5, reservations: 0.85 }),
		funnel: [
			{
				id: 'views',
				label: 'Guest views',
				value: '164',
				detail: 'Guests opened this venue',
				progress: 100
			},
			{
				id: 'requests',
				label: 'Reservation requests',
				value: '21',
				detail: 'Guests requested a booking',
				progress: 13
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '17',
				detail: 'Requests accepted',
				progress: 10
			},
			{
				id: 'cancelled',
				label: 'Cancelled',
				value: '3',
				detail: 'Guest or venue cancellations',
				progress: 2
			}
		],
		performance: {
			rows: [
				{
					id: 'skadarlija-studio',
					name: 'Skadarlija Studio',
					type: 'apartment',
					city: 'Belgrade',
					views: 81,
					requests: 13,
					confirmed: 10,
					conversionRate: '16%'
				},
				{
					id: 'dorcol-loft-14',
					name: 'Dorchol Loft 14',
					type: 'apartment',
					city: 'Belgrade',
					views: 61,
					requests: 7,
					confirmed: 5,
					conversionRate: '11%'
				},
				{
					id: 'savamala-rooms',
					name: 'Savamala Rooms',
					type: 'hostel',
					city: 'Belgrade',
					views: 22,
					requests: 1,
					confirmed: 1,
					conversionRate: '5%'
				}
			]
		}
	},
	'kalemegdan-walks': {
		id: 'kalemegdan-walks',
		title: 'Kalemegdan Walks',
		badge: 'Tour',
		metrics: [
			{
				id: 'views',
				label: 'Guest views',
				value: '126',
				detail: 'Venue opens from stays',
				trend: '+6%',
				tone: 'positive'
			},
			{
				id: 'requests',
				label: 'Requests',
				value: '17',
				detail: 'Reservations created',
				trend: '+8%',
				tone: 'positive'
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '11',
				detail: 'Accepted requests',
				trend: '65%',
				tone: 'neutral'
			},
			{
				id: 'pending',
				label: 'Pending',
				value: '4',
				detail: 'Waiting for response',
				trend: 'Review',
				tone: 'warning'
			}
		],
		activityData: scaleActivityData({ qrScans: 0.58, guestActivations: 0.45, reservations: 0.7 }),
		funnel: [
			{
				id: 'views',
				label: 'Guest views',
				value: '126',
				detail: 'Guests opened this venue',
				progress: 100
			},
			{
				id: 'requests',
				label: 'Reservation requests',
				value: '17',
				detail: 'Guests requested a booking',
				progress: 13
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '11',
				detail: 'Requests accepted',
				progress: 9
			},
			{
				id: 'cancelled',
				label: 'Cancelled',
				value: '2',
				detail: 'Guest or venue cancellations',
				progress: 2
			}
		],
		performance: {
			rows: [
				{
					id: 'savamala-rooms',
					name: 'Savamala Rooms',
					type: 'hostel',
					city: 'Belgrade',
					views: 64,
					requests: 11,
					confirmed: 8,
					conversionRate: '17%'
				},
				{
					id: 'kalemegdan-flat',
					name: 'Kalemegdan Flat',
					type: 'apartment',
					city: 'Belgrade',
					views: 10,
					requests: 1,
					confirmed: 0,
					conversionRate: '10%'
				},
				{
					id: 'dorcol-loft-14',
					name: 'Dorchol Loft 14',
					type: 'apartment',
					city: 'Belgrade',
					views: 53,
					requests: 3,
					confirmed: 2,
					conversionRate: '6%'
				}
			]
		}
	},
	'spa-centar': {
		id: 'spa-centar',
		title: 'Spa Centar',
		badge: 'Wellness',
		metrics: [
			{
				id: 'views',
				label: 'Guest views',
				value: '89',
				detail: 'Venue opens from stays',
				trend: '+4%',
				tone: 'positive'
			},
			{
				id: 'requests',
				label: 'Requests',
				value: '14',
				detail: 'Reservations created',
				trend: '+5%',
				tone: 'positive'
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '10',
				detail: 'Accepted requests',
				trend: '71%',
				tone: 'neutral'
			},
			{
				id: 'pending',
				label: 'Pending',
				value: '2',
				detail: 'Waiting for response',
				trend: 'Review',
				tone: 'warning'
			}
		],
		activityData: scaleActivityData({ qrScans: 0.46, guestActivations: 0.34, reservations: 0.55 }),
		funnel: [
			{
				id: 'views',
				label: 'Guest views',
				value: '89',
				detail: 'Guests opened this venue',
				progress: 100
			},
			{
				id: 'requests',
				label: 'Reservation requests',
				value: '14',
				detail: 'Guests requested a booking',
				progress: 16
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '10',
				detail: 'Requests accepted',
				progress: 11
			},
			{
				id: 'cancelled',
				label: 'Cancelled',
				value: '2',
				detail: 'Guest or venue cancellations',
				progress: 2
			}
		],
		performance: {
			rows: [
				{
					id: 'vracar-suite',
					name: 'Vracar Suite',
					type: 'apartment',
					city: 'Belgrade',
					views: 52,
					requests: 7,
					confirmed: 5,
					conversionRate: '13%'
				},
				{
					id: 'dorcol-loft-14',
					name: 'Dorchol Loft 14',
					type: 'apartment',
					city: 'Belgrade',
					views: 20,
					requests: 4,
					confirmed: 3,
					conversionRate: '20%'
				},
				{
					id: 'skadarlija-studio',
					name: 'Skadarlija Studio',
					type: 'apartment',
					city: 'Belgrade',
					views: 17,
					requests: 3,
					confirmed: 2,
					conversionRate: '18%'
				}
			]
		}
	},
	'wine-room': {
		id: 'wine-room',
		title: 'Wine Room',
		badge: 'Wine bar',
		metrics: [
			{
				id: 'views',
				label: 'Guest views',
				value: '35',
				detail: 'Venue opens from stays',
				trend: 'Quiet',
				tone: 'warning'
			},
			{
				id: 'requests',
				label: 'Requests',
				value: '8',
				detail: 'Reservations created',
				trend: '+2%',
				tone: 'neutral'
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '7',
				detail: 'Accepted requests',
				trend: '88%',
				tone: 'positive'
			},
			{
				id: 'pending',
				label: 'Pending',
				value: '0',
				detail: 'Waiting for response',
				trend: 'Clear',
				tone: 'positive'
			}
		],
		activityData: scaleActivityData({ qrScans: 0.25, guestActivations: 0.2, reservations: 0.3 }),
		funnel: [
			{
				id: 'views',
				label: 'Guest views',
				value: '35',
				detail: 'Guests opened this venue',
				progress: 100
			},
			{
				id: 'requests',
				label: 'Reservation requests',
				value: '8',
				detail: 'Guests requested a booking',
				progress: 23
			},
			{
				id: 'confirmed',
				label: 'Confirmed',
				value: '7',
				detail: 'Requests accepted',
				progress: 20
			},
			{
				id: 'cancelled',
				label: 'Cancelled',
				value: '1',
				detail: 'Guest or venue cancellations',
				progress: 3
			}
		],
		performance: {
			rows: [
				{
					id: 'kalemegdan-flat',
					name: 'Kalemegdan Flat',
					type: 'apartment',
					city: 'Belgrade',
					views: 20,
					requests: 3,
					confirmed: 3,
					conversionRate: '15%'
				},
				{
					id: 'skadarlija-studio',
					name: 'Skadarlija Studio',
					type: 'apartment',
					city: 'Belgrade',
					views: 40,
					requests: 2,
					confirmed: 2,
					conversionRate: '5%'
				},
				{
					id: 'savamala-rooms',
					name: 'Savamala Rooms',
					type: 'hostel',
					city: 'Belgrade',
					views: 28,
					requests: 1,
					confirmed: 1,
					conversionRate: '4%'
				}
			]
		}
	}
};

export const dummyUserAnalyticsReservationsPage: DummyUserAnalyticsReservationsPage = {
	metrics: [
		{
			id: 'created',
			label: 'Created',
			value: '96',
			detail: 'Reservation requests this month',
			trend: '+14%',
			tone: 'positive'
		},
		{
			id: 'confirmed',
			label: 'Confirmed',
			value: '71',
			detail: 'Requests accepted by partners',
			trend: '74%',
			tone: 'positive'
		},
		{
			id: 'pending',
			label: 'Pending',
			value: '8',
			detail: 'Waiting for partner response',
			trend: 'Review',
			tone: 'warning'
		},
		{
			id: 'cancelled',
			label: 'Cancelled',
			value: '11',
			detail: 'Guest or partner cancellations',
			trend: '-3%',
			tone: 'positive'
		}
	],
	statusChart: {
		data: [
			{ name: 'Created', value: 96, color: 'var(--chart-1)' },
			{ name: 'Confirmed', value: 71, color: 'var(--chart-2)' },
			{ name: 'Pending', value: 8, color: 'var(--chart-3)' },
			{ name: 'Cancelled', value: 11, color: 'var(--chart-4)' }
		]
	},
	table: {
		rows: [
			{
				id: 'mala-basta-evening',
				name: 'Mala Basta evening tables',
				detail: 'Restaurant requests after 18:00',
				created: 32,
				confirmed: 26,
				pending: 2,
				cancelled: 4,
				conversionRate: '81%'
			},
			{
				id: 'morning-cafe',
				name: 'Morning cafe requests',
				detail: 'Cafe bookings before 11:00',
				created: 21,
				confirmed: 17,
				pending: 1,
				cancelled: 3,
				conversionRate: '81%'
			},
			{
				id: 'weekend-tours',
				name: 'Weekend tour slots',
				detail: 'Walking tours Friday to Sunday',
				created: 17,
				confirmed: 11,
				pending: 4,
				cancelled: 2,
				conversionRate: '65%'
			},
			{
				id: 'wellness-slots',
				name: 'Wellness slots',
				detail: 'Spa and wellness reservations',
				created: 14,
				confirmed: 10,
				pending: 2,
				cancelled: 2,
				conversionRate: '71%'
			}
		]
	}
};

