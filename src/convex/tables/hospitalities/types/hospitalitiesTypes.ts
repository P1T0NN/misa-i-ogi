// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { ProjectionType } from '@/convex/helpers/createProjection';
import type {
	hospitalityDetailsSafe,
	hospitalityGuestReservationSafe
} from '@/convex/tables/hospitalities/validators/hospitalityQueryValidators';
import type { PartnershipBenefitSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

/** Union of all hospitality kinds — derived from the schema so it stays in sync. */
export type HospitalityType = Doc<'hospitalities'>['type'];

/** Reservation handling workflow available to a hospitality. */
export type ReservationMode = Doc<'hospitalities'>['reservationMode'];

/**
 * Public-safe `hospitalities` doc. The field list lives on `hospitalityDetailsSafe`;
 * anything not enumerated there (owner, storage keys, `connectCode`, `visibility`,
 * lifecycle, system metadata) can't reach a guest.
 */
export type HospitalityDetailsSafe = ProjectionType<typeof hospitalityDetailsSafe>;

export type HospitalityGuestReservationSafe = ProjectionType<
	typeof hospitalityGuestReservationSafe
>;

export type HospitalityDetailsResult =
	| {
			status: 'available';
			hospitality: HospitalityDetailsSafe;
			partnership: PartnershipBenefitSafe | null;
			guestReservation: HospitalityGuestReservationSafe | null;
	  }
	| { status: 'not_found' }
	| { status: 'not_partnered' };

/** Header stats across the owner's full hospitality portfolio (not just the current page). */
export type MyHospitalitiesSummary = {
	totalCount: number;
	activeCount: number;
	activePartnershipsCount: number;
};
