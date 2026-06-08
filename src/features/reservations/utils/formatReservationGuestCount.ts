export function formatReservationGuestCount(guestCount: number | undefined): string {
	if (guestCount === undefined) return '—';
	return guestCount === 1 ? '1 guest' : `${guestCount} guests`;
}
