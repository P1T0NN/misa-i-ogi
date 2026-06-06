// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getReservationsByAccommodations(
	ctx: QueryCtx,
	accommodationIds: Id<'accommodations'>[]
): Promise<Doc<'reservations'>[]> {
	const reservationGroups = await Promise.all(
		accommodationIds.map((id) =>
			ctx.db
				.query('reservations')
				.withIndex('by_accommodation', (q) => q.eq('accommodationId', id))
				.collect()
		)
	);

	return reservationGroups.flat();
}
