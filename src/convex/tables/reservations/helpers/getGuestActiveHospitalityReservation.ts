// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

const ACTIVE_GUEST_RESERVATION_STATUSES: ReservationStatus[] = ['pending', 'confirmed'];

/**
 * Finds the guest's open reservation for one hospitality.
 * Pending and confirmed requests block a new guest submission.
 */
export async function getGuestActiveHospitalityReservation(
	ctx: QueryCtx | MutationCtx,
	guestId: Id<'guests'>,
	hospitalityId: Id<'hospitalities'>
): Promise<Doc<'reservations'> | null> {
	for (const status of ACTIVE_GUEST_RESERVATION_STATUSES) {
		const reservation = await ctx.db
			.query('reservations')
			.withIndex('by_guest_hospitality_status', (q) =>
				q.eq('guestId', guestId).eq('hospitalityId', hospitalityId).eq('status', status)
			)
			.first();
		if (reservation) return reservation;
	}

	return null;
}
