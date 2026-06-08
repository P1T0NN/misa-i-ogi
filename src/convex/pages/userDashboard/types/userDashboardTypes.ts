// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

export type UserDashboardStatKey = 'stays' | 'venues' | 'activeLinks' | 'pendingReservations';

export type UserDashboardStat = {
	key: UserDashboardStatKey;
	label: string;
	value: string;
	detail: string;
};

export type UserDashboardPendingReservation = {
	id: Id<'reservations'>;
	guestName: string;
	hospitalityName: string;
	email: string;
	phone: string;
	guestCount: number;
	requestedTime: string;
	status: ReservationStatus;
};

export type UserDashboardPendingReservationsResult = {
	items: UserDashboardPendingReservation[];
	totalCount: number;
};
