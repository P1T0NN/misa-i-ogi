import type { UserAnalyticsPlaceDetailPerformanceRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

export type LandingAccommodationAnalyticsAreaChartPoint = {
	date: Date;
	qrScans: number;
	guestActivations: number;
	reservationRequests: number;
};

export type LandingHospitalityAnalyticsAreaChartPoint = {
	date: Date;
	guestViews: number;
	reservationRequests: number;
};

type LandingOwnerFeaturesPerformanceTableRow = UserAnalyticsPlaceDetailPerformanceRow;

export const landingAccommodationAnalyticsAreaChartData: LandingAccommodationAnalyticsAreaChartPoint[] =
	[
		{ date: new Date('2026-05-16'), qrScans: 18, guestActivations: 12, reservationRequests: 3 },
		{ date: new Date('2026-05-17'), qrScans: 21, guestActivations: 14, reservationRequests: 4 },
		{ date: new Date('2026-05-18'), qrScans: 17, guestActivations: 11, reservationRequests: 2 },
		{ date: new Date('2026-05-19'), qrScans: 24, guestActivations: 17, reservationRequests: 5 },
		{ date: new Date('2026-05-20'), qrScans: 28, guestActivations: 19, reservationRequests: 6 },
		{ date: new Date('2026-05-21'), qrScans: 25, guestActivations: 18, reservationRequests: 5 },
		{ date: new Date('2026-05-22'), qrScans: 31, guestActivations: 23, reservationRequests: 7 },
		{ date: new Date('2026-05-23'), qrScans: 36, guestActivations: 27, reservationRequests: 8 },
		{ date: new Date('2026-05-24'), qrScans: 33, guestActivations: 24, reservationRequests: 7 },
		{ date: new Date('2026-05-25'), qrScans: 29, guestActivations: 21, reservationRequests: 6 },
		{ date: new Date('2026-05-26'), qrScans: 38, guestActivations: 29, reservationRequests: 9 },
		{ date: new Date('2026-05-27'), qrScans: 42, guestActivations: 32, reservationRequests: 11 },
		{ date: new Date('2026-05-28'), qrScans: 39, guestActivations: 30, reservationRequests: 10 },
		{ date: new Date('2026-05-29'), qrScans: 46, guestActivations: 35, reservationRequests: 12 },
		{ date: new Date('2026-05-30'), qrScans: 51, guestActivations: 40, reservationRequests: 14 },
		{ date: new Date('2026-05-31'), qrScans: 48, guestActivations: 37, reservationRequests: 13 },
		{ date: new Date('2026-06-01'), qrScans: 44, guestActivations: 34, reservationRequests: 11 },
		{ date: new Date('2026-06-02'), qrScans: 53, guestActivations: 42, reservationRequests: 15 },
		{ date: new Date('2026-06-03'), qrScans: 57, guestActivations: 46, reservationRequests: 16 },
		{ date: new Date('2026-06-04'), qrScans: 54, guestActivations: 43, reservationRequests: 14 },
		{ date: new Date('2026-06-05'), qrScans: 61, guestActivations: 49, reservationRequests: 18 },
		{ date: new Date('2026-06-06'), qrScans: 68, guestActivations: 55, reservationRequests: 21 },
		{ date: new Date('2026-06-07'), qrScans: 64, guestActivations: 51, reservationRequests: 19 },
		{ date: new Date('2026-06-08'), qrScans: 59, guestActivations: 47, reservationRequests: 17 },
		{ date: new Date('2026-06-09'), qrScans: 66, guestActivations: 54, reservationRequests: 20 },
		{ date: new Date('2026-06-10'), qrScans: 72, guestActivations: 59, reservationRequests: 23 },
		{ date: new Date('2026-06-11'), qrScans: 69, guestActivations: 56, reservationRequests: 22 },
		{ date: new Date('2026-06-12'), qrScans: 75, guestActivations: 63, reservationRequests: 25 },
		{ date: new Date('2026-06-13'), qrScans: 82, guestActivations: 69, reservationRequests: 28 },
		{ date: new Date('2026-06-14'), qrScans: 78, guestActivations: 65, reservationRequests: 26 }
	];

export const landingHospitalityAnalyticsAreaChartData: LandingHospitalityAnalyticsAreaChartPoint[] =
	[
		{
			date: new Date('2026-05-16'),
			guestViews: 14,
			reservationRequests: 2
		},
		{
			date: new Date('2026-05-17'),
			guestViews: 17,
			reservationRequests: 3
		},
		{
			date: new Date('2026-05-18'),
			guestViews: 15,
			reservationRequests: 2
		},
		{
			date: new Date('2026-05-19'),
			guestViews: 19,
			reservationRequests: 4
		},
		{
			date: new Date('2026-05-20'),
			guestViews: 23,
			reservationRequests: 5
		},
		{
			date: new Date('2026-05-21'),
			guestViews: 22,
			reservationRequests: 5
		},
		{
			date: new Date('2026-05-22'),
			guestViews: 27,
			reservationRequests: 6
		},
		{
			date: new Date('2026-05-23'),
			guestViews: 32,
			reservationRequests: 8
		},
		{
			date: new Date('2026-05-24'),
			guestViews: 30,
			reservationRequests: 7
		},
		{
			date: new Date('2026-05-25'),
			guestViews: 26,
			reservationRequests: 6
		},
		{
			date: new Date('2026-05-26'),
			guestViews: 34,
			reservationRequests: 9
		},
		{
			date: new Date('2026-05-27'),
			guestViews: 37,
			reservationRequests: 10
		},
		{
			date: new Date('2026-05-28'),
			guestViews: 35,
			reservationRequests: 9
		},
		{
			date: new Date('2026-05-29'),
			guestViews: 41,
			reservationRequests: 12
		},
		{
			date: new Date('2026-05-30'),
			guestViews: 46,
			reservationRequests: 14
		},
		{
			date: new Date('2026-05-31'),
			guestViews: 44,
			reservationRequests: 13
		},
		{
			date: new Date('2026-06-01'),
			guestViews: 39,
			reservationRequests: 11
		},
		{
			date: new Date('2026-06-02'),
			guestViews: 48,
			reservationRequests: 15
		},
		{
			date: new Date('2026-06-03'),
			guestViews: 52,
			reservationRequests: 16
		},
		{
			date: new Date('2026-06-04'),
			guestViews: 50,
			reservationRequests: 15
		},
		{
			date: new Date('2026-06-05'),
			guestViews: 55,
			reservationRequests: 18
		},
		{
			date: new Date('2026-06-06'),
			guestViews: 63,
			reservationRequests: 22
		},
		{
			date: new Date('2026-06-07'),
			guestViews: 60,
			reservationRequests: 20
		},
		{
			date: new Date('2026-06-08'),
			guestViews: 56,
			reservationRequests: 18
		},
		{
			date: new Date('2026-06-09'),
			guestViews: 62,
			reservationRequests: 21
		},
		{
			date: new Date('2026-06-10'),
			guestViews: 67,
			reservationRequests: 24
		},
		{
			date: new Date('2026-06-11'),
			guestViews: 64,
			reservationRequests: 22
		},
		{
			date: new Date('2026-06-12'),
			guestViews: 71,
			reservationRequests: 26
		},
		{
			date: new Date('2026-06-13'),
			guestViews: 77,
			reservationRequests: 29
		},
		{
			date: new Date('2026-06-14'),
			guestViews: 74,
			reservationRequests: 27
		}
	];

export const landingOwnerFeaturesHospitalityAnalyticsTopAccommodationsTableRows = [
	{
		id: 'landing-source-accommodation-01',
		name: 'Apartment 1',
		type: 'apartment',
		city: 'Belgrade',
		views: 284,
		requests: 42,
		confirmed: 33
	},
	{
		id: 'landing-source-accommodation-02',
		name: 'Villa 1',
		type: 'villa',
		city: 'Belgrade',
		views: 241,
		requests: 36,
		confirmed: 29
	},
	{
		id: 'landing-source-accommodation-03',
		name: 'Studio 1',
		type: 'studio',
		city: 'Belgrade',
		views: 198,
		requests: 28,
		confirmed: 21
	},
	{
		id: 'landing-source-accommodation-04',
		name: 'Hotel 1',
		type: 'hotel',
		city: 'Belgrade',
		views: 171,
		requests: 24,
		confirmed: 18
	},
	{
		id: 'landing-source-accommodation-05',
		name: 'Apartment 2',
		type: 'apartment',
		city: 'Belgrade',
		views: 146,
		requests: 19,
		confirmed: 14
	}
] satisfies LandingOwnerFeaturesPerformanceTableRow[];

export const landingOwnerFeaturesAccommodationAnalyticsTopHospitalitiesTableRows = [
	{
		id: 'landing-hospitality-partner-01',
		name: 'Restaurant 1',
		type: 'restaurant',
		city: 'Belgrade',
		views: 312,
		requests: 47,
		confirmed: 38
	},
	{
		id: 'landing-hospitality-partner-02',
		name: 'Restaurant 2',
		type: 'restaurant',
		city: 'Belgrade',
		views: 266,
		requests: 39,
		confirmed: 31
	},
	{
		id: 'landing-hospitality-partner-03',
		name: 'Massage Space',
		type: 'massage',
		city: 'Belgrade',
		views: 224,
		requests: 31,
		confirmed: 24
	},
	{
		id: 'landing-hospitality-partner-04',
		name: 'Horse Riding',
		type: 'horse_riding',
		city: 'Belgrade',
		views: 181,
		requests: 23,
		confirmed: 17
	},
	{
		id: 'landing-hospitality-partner-05',
		name: 'Night Club',
		type: 'night_club',
		city: 'Belgrade',
		views: 154,
		requests: 18,
		confirmed: 13
	}
] satisfies LandingOwnerFeaturesPerformanceTableRow[];

export type LandingReservationRequestRow = {
	id: string;
	guestName: string;
	venueName: string;
	venueType: string;
	sourceAccommodation: string;
	guestCount: number;
	requestedTime: string;
	status: ReservationStatus;
	image: string;
};

export type LandingReservationStatusSummaryItem = {
	status: ReservationStatus;
	count: number;
};

export const landingOwnerFeaturesReservationRequests: LandingReservationRequestRow[] = [
	{
		id: 'landing-reservation-01',
		guestName: 'Marko P.',
		venueName: 'Restaurant 1',
		venueType: 'restaurant',
		sourceAccommodation: 'Apartment 1',
		guestCount: 2,
		requestedTime: 'Tonight · 20:00',
		status: 'pending',
		image: '/images/dummyHospitalities/restaurant1.png'
	},
	{
		id: 'landing-reservation-02',
		guestName: 'Ana K.',
		venueName: 'Massage Space',
		venueType: 'massage',
		sourceAccommodation: 'Villa 1',
		guestCount: 1,
		requestedTime: 'Tomorrow · 11:30',
		status: 'confirmed',
		image: '/images/dummyHospitalities/massage1.png'
	},
	{
		id: 'landing-reservation-03',
		guestName: 'Ivan R.',
		venueName: 'Restaurant 2',
		venueType: 'restaurant',
		sourceAccommodation: 'Studio 1',
		guestCount: 4,
		requestedTime: 'Wed · 21:00',
		status: 'no_show',
		image: '/images/dummyHospitalities/restaurant1.png'
	},
	{
		id: 'landing-reservation-04',
		guestName: 'Sofia M.',
		venueName: 'Night Club',
		venueType: 'night_club',
		sourceAccommodation: 'Hotel 1',
		guestCount: 3,
		requestedTime: 'Sat · 23:00',
		status: 'cancelled',
		image: '/images/dummyHospitalities/nightclub1.png'
	}
];

export const landingOwnerFeaturesReservationStatusSummary: LandingReservationStatusSummaryItem[] = [
	{ status: 'pending', count: 6 },
	{ status: 'confirmed', count: 18 },
	{ status: 'cancelled', count: 3 },
	{ status: 'no_show', count: 2 }
];

export type LandingPartnershipOfferKind = 'discount' | 'perk';

export type LandingPartnershipPartner = {
	id: string;
	name: string;
	type: string;
	offer: string;
	offerKind: LandingPartnershipOfferKind;
	image: string;
};

export const landingOwnerFeaturesPartnershipPartners: LandingPartnershipPartner[] = [
	{
		id: 'landing-partnership-partner-01',
		name: 'Restaurant 1',
		type: 'restaurant',
		offer: '15% off dinner',
		offerKind: 'discount',
		image: '/images/dummyHospitalities/restaurant1.png'
	},
	{
		id: 'landing-partnership-partner-02',
		name: 'Massage Space',
		type: 'massage',
		offer: '20% off treatments',
		offerKind: 'discount',
		image: '/images/dummyHospitalities/massage1.png'
	},
	{
		id: 'landing-partnership-partner-03',
		name: 'Wine Bar 1',
		type: 'bar',
		offer: '10% off the bill',
		offerKind: 'discount',
		image: '/images/dummyHospitalities/winebar1.png'
	},
	{
		id: 'landing-partnership-partner-04',
		name: 'Restaurant 2',
		type: 'restaurant',
		offer: 'Welcome drink',
		offerKind: 'perk',
		image: '/images/dummyHospitalities/restaurant1.png'
	}
];
