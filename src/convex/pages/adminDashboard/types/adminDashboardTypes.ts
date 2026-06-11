// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

export type AdminDashboardTotals = {
	users: number;
	accommodations: number;
	activeAccommodations: number;
	hospitalities: number;
	activeHospitalities: number;
	partnerships: number;
	guests: number;
};

export type AdminDashboardSetupHealthCounts = {
	inactiveAccommodations: number;
	inactiveHospitalities: number;
	unlinkedAccommodations: number;
	unlinkedHospitalities: number;
	pendingReservations: number;
};

export type AdminDashboardPageResult = {
	totals: AdminDashboardTotals;
	reservationCounts: Record<ReservationStatus, number>;
	setupHealth: AdminDashboardSetupHealthCounts;
	recentReservations: Doc<'reservations'>[];
};
