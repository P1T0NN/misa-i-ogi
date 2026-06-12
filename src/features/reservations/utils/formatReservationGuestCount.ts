// UTILS
import { reservationGuestCount } from '@/features/reservations/i18n/reservationDisplay';

export function formatReservationGuestCount(guestCount: number | undefined): string {
	return reservationGuestCount(guestCount);
}
