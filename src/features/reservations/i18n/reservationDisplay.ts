// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// TYPES
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

/**
 * Localized reservation display strings.
 *
 * Import these from feature code that needs labels without badge styling.
 * UI that shows status badges should keep using `getReservationStatusMeta`.
 */
export function reservationStatusLabel(status: ReservationStatus): string {
	switch (status) {
		case 'pending':
			return m['ReservationDisplay.statusPending']();
		case 'confirmed':
			return m['ReservationDisplay.statusConfirmed']();
		case 'cancelled':
			return m['ReservationDisplay.statusCancelled']();
		case 'no_show':
			return m['ReservationDisplay.statusNoShow']();
	}
}

export function reservationGuestCount(guestCount: number | undefined): string {
	if (guestCount === undefined) return m['ReservationDisplay.guestCountEmpty']();
	if (guestCount === 1) return m['ReservationDisplay.guestCountOne']();
	return m['ReservationDisplay.guestCountMany']({ count: guestCount });
}
