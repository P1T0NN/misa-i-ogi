// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getUserOwnedAccommodations(
	ctx: QueryCtx,
	userId: string
): Promise<Doc<'accommodations'>[]> {
	return ctx.db
		.query('accommodations')
		.withIndex('by_owner', (q) => q.eq('ownerId', userId))
		.collect();
}
