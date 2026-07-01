// LIBRARIES
import { components } from './_generated/api';
import { defineAnalytics, event, property } from '@piton-/analytics-convex';

// HELPERS
import { requireAdmin } from '@/convex/auth/middleware/authMiddleware';

// TYPES
import type { QueryCtx, MutationCtx } from '@/convex/_generated/server';

export const analytics = defineAnalytics(components.analytics, {
	events: {
		qrScanned: event('qr.scanned', {
			label: 'QR scanned',
			properties: {
				accommodationId: property.string(),
				accommodationName: property.string(),
				scanType: property.string()
			}
		}),
		hospitalityViewed: event('hospitality.viewed', {
			label: 'Hospitality viewed',
			properties: {
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				accommodationId: property.string(),
				accommodationName: property.string()
			}
		}),
		guestActivated: event('guest.activated', {
			label: 'Guest activated',
			properties: {
				accommodationId: property.string({ required: true }),
				accommodationName: property.string(),
				accommodationType: property.string()
			}
		}),
		guestReturned: event('guest.returned', {
			label: 'Guest returned',
			properties: {
				accommodationId: property.string(),
				accommodationName: property.string()
			}
		}),
		reservationCreated: event('reservation.created', {
			label: 'Reservation created',
			properties: {
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				hospitalityType: property.string(),
				accommodationId: property.string(),
				accommodationName: property.string()
			}
		}),
		reservationConfirmed: event('reservation.confirmed', {
			label: 'Reservation confirmed',
			properties: {
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				hospitalityType: property.string(),
				accommodationId: property.string(),
				accommodationName: property.string()
			}
		}),
		reservationCancelled: event('reservation.cancelled', {
			label: 'Reservation cancelled',
			properties: {
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				hospitalityType: property.string(),
				accommodationId: property.string(),
				accommodationName: property.string(),
				reason: property.string()
			}
		}),
		reservationNoShow: event('reservation.no_show', {
			label: 'Reservation no-show',
			properties: {
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				hospitalityType: property.string(),
				accommodationId: property.string(),
				accommodationName: property.string(),
				reason: property.string()
			}
		}),
		accommodationRegistered: event('accommodation.registered', {
			label: 'Accommodation registered',
			properties: {
				accommodationId: property.string({ required: true }),
				accommodationName: property.string(),
				accommodationType: property.string()
			}
		}),
		hospitalityClaimed: event('hospitality.claimed', {
			label: 'Hospitality claimed',
			properties: {
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				hospitalityType: property.string()
			}
		}),
		partnershipCreated: event('partnership.created', {
			label: 'Partnership created',
			properties: {
				accommodationId: property.string({ required: true }),
				accommodationName: property.string(),
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				benefit: property.string(),
				partnershipDelta: property.number({ required: true })
			}
		}),
		partnershipDeactivated: event('partnership.deactivated', {
			label: 'Partnership deactivated',
			properties: {
				accommodationId: property.string({ required: true }),
				accommodationName: property.string(),
				hospitalityId: property.string({ required: true }),
				hospitalityName: property.string(),
				partnershipDelta: property.number({ required: true })
			}
		})
	},
	metrics: ({ count, sum }) => ({
		qrScans: count('QR scans')
			.description('Total QR code scans')
			.from('qr.scanned')
			.by('accommodationId', 'scanType')
			.evaluation({
				kind: 'goal',
				targetValue: 500,
				excellentPercentOfGoal: 100,
				goodPercentOfGoal: 75,
				badPercentOfGoal: 50
			}),

		// Activations happen at accommodations and are not attributable to a single
		// venue — venue pages attribute them by summing partner-accommodation totals.
		guestActivations: count('Guest activations')
			.description('Guest sessions activated')
			.from('guest.activated')
			.by('accommodationId', 'accommodationType')
			.evaluation({
				kind: 'conversion',
				denominatorMetric: 'qrScans',
				excellentRatePercent: 50,
				goodRatePercent: 20,
				badRatePercent: 10,
				minDenominator: 5
			}),

		hospitalityViews: count('Guest views')
			.description('Unique guest views of hospitalities')
			.from('hospitality.viewed')
			.by('hospitalityId', 'accommodationId')
			.evaluation({
				kind: 'goal',
				targetValue: 300,
				excellentPercentOfGoal: 100,
				goodPercentOfGoal: 75,
				badPercentOfGoal: 50
			}),

		newReservations: count('New reservations')
			.description('Reservations created by guests')
			.from('reservation.created')
			.by('hospitalityId', 'hospitalityType', 'accommodationId')
			.evaluation({
				kind: 'comparison',
				excellentGrowthPercent: 25,
				goodGrowthPercent: 5,
				badGrowthPercent: -5,
				minVolumeForComparison: 10
			}),

		confirmedReservations: count('Confirmed reservations')
			.description('Reservations confirmed by venues')
			.from('reservation.confirmed')
			.by('hospitalityId', 'hospitalityType', 'accommodationId')
			.evaluation({
				kind: 'comparison',
				excellentGrowthPercent: 25,
				goodGrowthPercent: 5,
				badGrowthPercent: -5,
				minVolumeForComparison: 10
			}),

		cancelledReservations: count('Cancelled reservations')
			.description('Reservations cancelled by venues or guests')
			.from('reservation.cancelled')
			.by('hospitalityId', 'hospitalityType', 'accommodationId')
			.evaluation({
				kind: 'inverseRate',
				denominatorMetric: 'newReservations',
				goodRatePercent: 10,
				badRatePercent: 25
			}),

		activePartnerships: sum('Active partnerships', 'count')
			.description('Net partnerships (created minus deactivated)')
			.from('partnership.created', 'partnership.deactivated')
			.value('partnershipDelta')
			.by('accommodationId', 'hospitalityId')
	}),
	// Funnels intentionally omitted for launch — the package supports them; define
	// them here (and re-export `funnelConversion` / `journeyConversion` from
	// `analytics.client`) when funnel dashboards are built.
	authorize: async (ctx, operation) => {
		// App queries call server helpers after enforcing auth. Keep direct client reads open for now,
		// but protect runtime goal edits because those persist per-scope overrides.
		if (operation.type === 'configureMetricEvaluation') {
			await requireAdmin(ctx as unknown as QueryCtx | MutationCtx);
		}
	}
});

export const {
	processPendingHighVolumeAnalyticsEvents,
	purgeStaleAnalyticsEvents,
	purgeStaleAnalyticsRollups
} = analytics.crons;

export const {
	writeConfiguration,
	writeTrack,
	timeSeries,
	summary,
	breakdown,
	metricComparison,
	metricConversion,
	metricEvaluation,
	metricEvaluationConfig,
	setMetricEvaluation,
	dashboardMetrics,
	metricTotalsByDimension,
	topDimensionValue
} = analytics.client;
