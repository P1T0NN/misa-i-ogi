// TYPES
import type { Doc } from '@/convex/_generated/dataModel';

/** Union of all hospitality kinds — derived from the schema so it stays in sync. */
export type HospitalityType = Doc<'hospitalities'>['type'];

/** Reservation handling workflow available to a hospitality. */
export type ReservationMode = Doc<'hospitalities'>['reservationMode'];

/** Public-safe `hospitalities` doc — strips owner, storage keys, lifecycle, and system metadata. */
export type HospitalityDetailsSafe = Omit<
	Doc<'hospitalities'>,
	'ownerId' | 'coverImageKey' | 'menuFileKey' | 'reservationMode' | 'isActive' | '_creationTime'
>;

export type HospitalityGuestReservation = Pick<
	Doc<'reservations'>,
	'guestName' | 'email' | 'phone' | 'guestCount' | 'requestedTime'
> & {
	status: 'pending' | 'confirmed';
};

export type HospitalityPartnershipBenefit = Pick<
	Doc<'partnerships'>,
	'_id' | 'benefit' | 'discountPercentage'
>;

/** @deprecated Use `HospitalityGuestReservation`. */
export type HospitalityGuestPendingReservation = HospitalityGuestReservation;

export type HospitalityDetailsResult =
	| {
			status: 'available';
			hospitality: HospitalityDetailsSafe;
			partnership: HospitalityPartnershipBenefit | null;
			guestReservation: HospitalityGuestReservation | null;
	  }
	| { status: 'not_found' }
	| { status: 'not_partnered' };

/** Header stats across the owner's full hospitality portfolio (not just the current page). */
export type MyHospitalitiesSummary = {
	totalCount: number;
	activeCount: number;
	activePartnershipsCount: number;
};
