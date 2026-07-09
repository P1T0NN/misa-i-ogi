// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `reservations` — guest reservation requests on hospitality pages.
 */
export const reservationFields = {
	hospitalityId: v.id('hospitalities'),
	/** Denormalized from `hospitalities.name` for owner-facing reservation lists. */
	hospitalityName: v.string(),
	/** Denormalized from `hospitalities.ownerId` for efficient owner-scoped dashboards. */
	hospitalityOwnerId: v.string(),
	guestId: v.id('guests'),
	accommodationId: v.id('accommodations'),

	guestName: v.string(),
	/** Optional — guests may submit a reservation with phone only. */
	email: v.optional(v.string()),
	phone: v.string(),
	/** Party size submitted with the reservation request. */
	guestCount: v.number(),
	/** Guest-chosen time slot ("HH:mm" in 24h format). */
	requestedTime: v.string(),

	status: v.union(
		v.literal('pending'),
		v.literal('confirmed'),
		v.literal('cancelled'),
		v.literal('no_show')
	)
};
