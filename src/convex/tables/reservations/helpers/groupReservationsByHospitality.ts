// TYPES
import type { Doc } from '@/convex/_generated/dataModel';

export function groupReservationsByHospitality(
	reservations: Doc<'reservations'>[]
): Map<string, Doc<'reservations'>[]> {
	const reservationsByHospitality = new Map<string, Doc<'reservations'>[]>();

	for (const reservation of reservations) {
		const list = reservationsByHospitality.get(reservation.hospitalityId) ?? [];
		list.push(reservation);
		reservationsByHospitality.set(reservation.hospitalityId, list);
	}

	return reservationsByHospitality;
}
