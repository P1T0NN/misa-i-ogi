// LIBRARIES
import { v } from 'convex/values';

export const reservationStatusValidator = v.union(
	v.literal('pending'),
	v.literal('confirmed'),
	v.literal('cancelled'),
	v.literal('no_show')
);

export const reservationDocValidator = v.object({
	_id: v.id('reservations'),
	_creationTime: v.number(),
	hospitalityId: v.id('hospitalities'),
	hospitalityName: v.string(),
	hospitalityOwnerId: v.string(),
	guestId: v.id('guests'),
	accommodationId: v.id('accommodations'),
	guestName: v.string(),
	email: v.optional(v.string()),
	phone: v.string(),
	guestCount: v.number(),
	requestedTime: v.string(),
	status: reservationStatusValidator
});

export const fetchOptimizedReservationsResultValidator = v.object({
	page: v.array(reservationDocValidator),
	isDone: v.boolean(),
	continueCursor: v.string(),
	totalCount: v.union(v.number(), v.null())
});

export const reservationCountsValidator = v.object({
	pending: v.number(),
	confirmed: v.number(),
	cancelled: v.number(),
	no_show: v.number()
});

export const fetchReservationsSummaryResultValidator = v.object({
	hospitalityNames: v.array(v.string()),
	counts: reservationCountsValidator
});
