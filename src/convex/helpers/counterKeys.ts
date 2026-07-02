// TYPES
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

/**
 * Central registry of `analytics.counters` keys — exact transactional state
 * counts. Every insert/delete/status-flip of the counted rows must bump the
 * matching key in the same mutation, or the counter drifts. Repair with
 * `migrations/backfillCountersInternal:backfillCounters`.
 */
export const COUNTER_KEYS = {
	GUESTS_TOTAL: 'guests.total'
} as const;

export const RESERVATION_STATUSES: ReservationStatus[] = [
	'pending',
	'confirmed',
	'cancelled',
	'no_show'
];

export function reservationStatusCounterKey(status: ReservationStatus): string {
	return `reservations.${status}`;
}
