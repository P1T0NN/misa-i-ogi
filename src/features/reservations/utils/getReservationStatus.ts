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
				label: 'Pending',
				badgeVariant: 'default',
				badgeClass: 'bg-yellow-500 text-white hover:bg-yellow-500/90'
			};
		case 'confirmed':
			return { label: 'Confirmed', badgeVariant: 'success' };
		case 'cancelled':
			return { label: 'Cancelled', badgeVariant: 'destructive' };
		case 'no_show':
			return { label: 'No-show', badgeVariant: 'secondary' };
	}
}
