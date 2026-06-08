// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';

/** Lifecycle status for a reservation request. */
export type ReservationStatus = Doc<'reservations'>['status'];

/** Reservation as stored — full row shape. */
export type ReservationDoc = Doc<'reservations'>;

export type ReservationCounts = Record<ReservationStatus, number>;

export type FetchReservationsSummaryResult = {
	hospitalityNames: string[];
	counts: ReservationCounts;
};

/** Input shape for creating a reservation (no mutations yet — UI-only for now). */
export type CreateReservationInput = {
	hospitalityId: Id<'hospitalities'>;
	hospitalityName: string;
	hospitalityOwnerId: string;
	guestId: Id<'guests'>;
	accommodationId: Id<'accommodations'>;
	guestName: string;
	email: string;
	phone: string;
	guestCount: number;
	requestedTime: string;
};
