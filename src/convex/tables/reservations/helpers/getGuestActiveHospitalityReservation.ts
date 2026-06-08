// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';
import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';

const ACTIVE_GUEST_RESERVATION_STATUSES = new Set<ReservationStatus>(['pending', 'confirmed']);

/**
 * Finds the guest's open reservation for one hospitality.
 * Pending and confirmed requests block a new guest submission.
 */
export async function getGuestActiveHospitalityReservation(
	ctx: QueryCtx | MutationCtx,
	guestId: Id<'guests'>,
	hospitalityId: Id<'hospitalities'>
): Promise<Doc<'reservations'> | null> {
	const guestReservations = await ctx.db
		.query('reservations')
		.withIndex('by_guest', (q) => q.eq('guestId', guestId))
		.collect();

	return (
		guestReservations.find(
			(reservation) =>
				reservation.hospitalityId === hospitalityId &&
				ACTIVE_GUEST_RESERVATION_STATUSES.has(reservation.status)
		) ?? null
	);
}
