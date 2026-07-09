// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Returns the active *explicit* (custom) partnership for a pair, when one exists. */
export async function getActiveAccommodationPartnership(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	hospitalityId: Id<'hospitalities'>
): Promise<Doc<'partnerships'> | null> {
	const partnership = await ctx.db
		.query('partnerships')
		.withIndex('by_pair', (q) =>
			q.eq('accommodationId', accommodationId).eq('hospitalityId', hospitalityId)
		)
		.first();

	if (!partnership?.isActive) return null;

	return partnership;
}
