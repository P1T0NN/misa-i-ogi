// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

export type UserDashboardStatKey =
	| 'accommodations'
	| 'hospitalities'
	| 'partnerships'
	| 'pendingReservations';

export type UserDashboardCounts = {
	accommodations: number;
	activeAccommodations: number;
	hospitalities: number;
	activeHospitalities: number;
	partnerships: number;
	pendingReservations: number;
};

export type UserDashboardPendingReservation = {
	id: Id<'reservations'>;
	guestName: string;
	hospitalityName: string;
	email?: string;
	phone: string;
	guestCount: number;
	requestedTime: string;
	status: ReservationStatus;
};

export type UserDashboardPendingReservationsResult = {
	items: UserDashboardPendingReservation[];
	totalCount: number;
};
