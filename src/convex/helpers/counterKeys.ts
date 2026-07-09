// TYPES
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

/**
 * Central registry of `analytics.counters` keys — exact transactional state
 * counts. Every insert/delete/status-flip of the counted rows must bump the
 * matching key in the same mutation, or the counter drifts. Repair with
 * `migrations/backfillCountersInternal:backfillCounters`.
 */
export const COUNTER_KEYS = {
	GUESTS_TOTAL: 'guests.total',
	ACCOMMODATIONS_TOTAL: 'accommodations.total',
	HOSPITALITIES_TOTAL: 'hospitalities.total',
	// Every partnership row, active or trial-deactivated (soft-deactivation keeps
	// the row, so this is a pure insert/delete count — never bumped on isActive flips).
	PARTNERSHIPS_TOTAL: 'partnerships.total'
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

/** Per hospitality-owner reservation counts by status. */
export function ownerReservationStatusCounterKey(
	ownerId: string,
	status: ReservationStatus
): string {
	return `reservations.owner.${ownerId}.${status}`;
}

/**
 * Active partnership links touching a user (accommodation or hospitality owner).
 * +1 on insert/reactivate, −1 on revoke/soft-deactivate.
 */
export function activePartnershipsCounterKey(userId: string): string {
	return `activePartnerships.count:${userId}`;
}

/**
 * Live custom partnerships per accommodation owner. +1 on first insert or
 * reactivation, −1 on trial deactivation or revoke. Never touched on request send.
 */
export function customPartnershipsCounterKey(userId: string): string {
	return `customPartnerships.count:${userId}`;
}
