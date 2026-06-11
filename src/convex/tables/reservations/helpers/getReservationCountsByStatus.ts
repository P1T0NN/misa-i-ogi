// TYPES
import type { QueryCtx } from '@/convex/_generated/server';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

const RESERVATION_STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'cancelled', 'no_show'];

export async function getReservationCountsByStatus(ctx: QueryCtx) {
	const counts = await Promise.all(
		RESERVATION_STATUSES.map(async (status) => {
			const reservations = await ctx.db
				.query('reservations')
				.withIndex('by_status', (q) => q.eq('status', status))
				.collect();

			return [status, reservations.length] as const;
		})
	);

	return Object.fromEntries(counts) as Record<ReservationStatus, number>;
}
