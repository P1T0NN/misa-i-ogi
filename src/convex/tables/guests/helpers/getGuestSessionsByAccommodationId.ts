// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

/** All guest session rows for an accommodation (active and expired). */
export async function getGuestSessionsByAccommodationId(
	ctx: QueryCtx,
	accommodationId: Id<'accommodations'>
): Promise<Doc<'guests'>[]> {
	return ctx.db
		.query('guests')
		.withIndex('by_accommodation', (q) => q.eq('accommodationId', accommodationId))
		.collect();
}
