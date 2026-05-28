import type {
	ReservationDoc,
	ReservationStatus
} from '@/convex/tables/reservations/types/reservationsTypes.js';

export function filterReservations({
	reservations,
	statuses,
	searchQuery,
	selectedHospitality
}: {
	reservations: ReservationDoc[];
	statuses: ReservationStatus[];
	searchQuery: string;
	selectedHospitality: string;
}) {
	let filtered = reservations.filter((reservation) => statuses.includes(reservation.status));

	if (searchQuery.trim()) {
		const query = searchQuery.trim().toLowerCase();
		filtered = filtered.filter(
			(reservation) =>
				(reservation.guestName ?? '').toLowerCase().includes(query) ||
				(reservation.hospitalityName ?? '').toLowerCase().includes(query) ||
				reservation.email.toLowerCase().includes(query) ||
				reservation.phone.toLowerCase().includes(query) ||
				String(reservation.hospitalityId).toLowerCase().includes(query) ||
				String(reservation.guestId).toLowerCase().includes(query)
		);
	}

	if (selectedHospitality !== 'all') {
		filtered = filtered.filter(
			(reservation) => reservation.hospitalityName === selectedHospitality
		);
	}

	return filtered;
}
