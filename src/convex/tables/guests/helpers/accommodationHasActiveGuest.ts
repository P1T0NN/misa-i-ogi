// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

/** True when the accommodation still has at least one unexpired guest session row. */
export async function accommodationHasActiveGuest(
	ctx: QueryCtx,
	accommodationId: Id<'accommodations'>,
	asOfMs: number = Date.now()
): Promise<boolean> {
	const activeGuest = await ctx.db
		.query('guests')
		.withIndex('by_accommodation_expires', (q) =>
			q.eq('accommodationId', accommodationId).gte('expiresAt', asOfMs)
		)
		.first();

	return activeGuest !== null;
}
