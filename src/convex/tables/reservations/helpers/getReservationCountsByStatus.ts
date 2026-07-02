// HELPERS
import { analytics } from '@/convex/analytics';
import { RESERVATION_STATUSES, reservationStatusCounterKey } from '@/convex/helpers/counterKeys';

// TYPES
import type { QueryCtx } from '@/convex/_generated/server';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

/**
 * O(1) exact per-status counts — reads the `reservations.*` counters
 * maintained transactionally by the reservation mutations instead of
 * collecting every row in all four status indexes.
 */
export async function getReservationCountsByStatus(ctx: QueryCtx) {
	const counts = await analytics.counters.getMany(
		ctx,
		RESERVATION_STATUSES.map(reservationStatusCounterKey)
	);

	return Object.fromEntries(
		RESERVATION_STATUSES.map((status) => [status, counts[reservationStatusCounterKey(status)] ?? 0])
	) as Record<ReservationStatus, number>;
}
