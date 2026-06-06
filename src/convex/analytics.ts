// LIBRARIES
import { components } from './_generated/api';
import { defineAnalytics, event, property } from '@piton-/analytics-convex';

export const analytics = defineAnalytics(components.analytics, {
	events: {
		qrScanned: event('qr.scanned', {
			label: 'QR scanned',
			properties: {
				accommodationId: property.string(),
				accommodationName: property.string(),
				hospitalityId: property.string(),
				hospitalityName: property.string(),
				scanType: property.string()
			}
		}),
		guestActivated: event('guest.activated', {
			label: 'Guest activated',
			properties: {
				accommodationId: property.string({ required: true }),
				accommodationName: property.string(),
				accommodationType: property.string(),
				hospitalityId: property.string()
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
			.by('accommodationId', 'hospitalityId', 'scanType'),

		guestActivations: count('Guest activations')
			.description('Guest sessions activated')
			.from('guest.activated')
			.by('accommodationId', 'accommodationType', 'hospitalityId'),

		guestViews: count('Guest views')
			.description('Guest views of hospitalities via QR scans')
			.from('qr.scanned')
			.by('hospitalityId', 'scanType'),

		newReservations: count('New reservations')
			.description('Reservations created by guests')
			.from('reservation.created')
			.by('hospitalityId', 'hospitalityType', 'accommodationId'),

		confirmedReservations: count('Confirmed reservations')
			.description('Reservations confirmed by venues')
			.from('reservation.confirmed')
			.by('hospitalityId', 'hospitalityType', 'accommodationId'),

		cancelledReservations: count('Cancelled reservations')
			.description('Reservations cancelled by venues or guests')
			.from('reservation.cancelled')
			.by('hospitalityId', 'hospitalityType', 'accommodationId'),

		activePartnerships: sum('Active partnerships', 'count')
			.description('Net partnerships (created minus deactivated)')
			.from('partnership.created', 'partnership.deactivated')
			.value('partnershipDelta')
			.by('accommodationId', 'hospitalityId')
	}),
	authorize: async () => {
		// Auth is handled at the query level — open reads for now
	}
});

export const { writeConfiguration, writeTrack, timeSeries, summary, breakdown, metricComparison } =
	analytics.client;
