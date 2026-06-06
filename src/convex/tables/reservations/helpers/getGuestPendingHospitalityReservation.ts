// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/**
 * Finds the guest's currently pending request for one hospitality.
 * Uses the guest index so lookup cost scales with the guest's reservation history,
 * not the global reservations table.
 */
export async function getGuestPendingHospitalityReservation(
	ctx: QueryCtx | MutationCtx,
	guestId: Id<'guests'>,
	hospitalityId: Id<'hospitalities'>
): Promise<Doc<'reservations'> | null> {
	const guestReservations = await ctx.db
		.query('reservations')
		.withIndex('by_guest', (q) => q.eq('guestId', guestId))
		.collect();

	const pendingReservation =
		guestReservations.find(
			(reservation) =>
				reservation.hospitalityId === hospitalityId && reservation.status === 'pending'
		) ?? null;

	return pendingReservation;
}
