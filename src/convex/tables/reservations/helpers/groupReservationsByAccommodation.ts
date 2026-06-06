// TYPES
import type { Doc } from '@/convex/_generated/dataModel';

export function groupReservationsByAccommodation(
	reservations: Doc<'reservations'>[]
): Map<string, Doc<'reservations'>[]> {
	const reservationsByAccommodation = new Map<string, Doc<'reservations'>[]>();

	for (const reservation of reservations) {
		const list = reservationsByAccommodation.get(reservation.accommodationId) ?? [];
		list.push(reservation);
		reservationsByAccommodation.set(reservation.accommodationId, list);
	}

	return reservationsByAccommodation;
}
