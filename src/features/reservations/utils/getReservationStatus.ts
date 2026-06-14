// I18N
import { reservationStatusLabel } from '@/features/reservations/i18n/reservationDisplay';

// TYPES
import type { BadgeVariant } from '@/shared/components/ui/badge/index.js';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes.js';

export type ReservationStatusMeta = {
	label: string;
	badgeVariant: BadgeVariant;
	badgeClass?: string;
};

export function getReservationStatusMeta(status: ReservationStatus): ReservationStatusMeta {
	switch (status) {
		case 'pending':
			return {
				label: reservationStatusLabel(status),
				badgeVariant: 'default'
			};
		case 'confirmed':
			return { label: reservationStatusLabel(status), badgeVariant: 'success' };
		case 'cancelled':
			return { label: reservationStatusLabel(status), badgeVariant: 'destructive' };
		case 'no_show':
			return { label: reservationStatusLabel(status), badgeVariant: 'secondary' };
	}
}
