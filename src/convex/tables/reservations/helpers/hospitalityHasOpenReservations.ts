// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

const OPEN_RESERVATION_STATUSES = ['pending', 'confirmed'] as const;

/** Pending or confirmed — terminal statuses (cancelled, no_show) are fine. */
export async function hospitalityHasOpenReservations(
	ctx: QueryCtx,
	hospitalityId: Id<'hospitalities'>
): Promise<boolean> {
	for (const status of OPEN_RESERVATION_STATUSES) {
		const openReservation = await ctx.db
			.query('reservations')
			.withIndex('by_hospitality_status', (q) =>
				q.eq('hospitalityId', hospitalityId).eq('status', status)
			)
			.first();
		if (openReservation) return true;
	}

	return false;
}
