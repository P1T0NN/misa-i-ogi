// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

/** Pending or confirmed — terminal statuses (cancelled, no_show) are fine. */
export async function hospitalityHasOpenReservations(
	ctx: QueryCtx,
	hospitalityId: Id<'hospitalities'>
): Promise<boolean> {
	const reservations = await ctx.db
		.query('reservations')
		.withIndex('by_hospitality', (q) => q.eq('hospitalityId', hospitalityId))
		.collect();
	return reservations.some(
		(reservation) => reservation.status === 'pending' || reservation.status === 'confirmed'
	);
}
