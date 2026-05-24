// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx, MutationCtx } from '@/convex/_generated/server';

/** Returns the row when it exists and belongs to `ownerId`; otherwise `null`. */
export async function getOwnedAccommodation(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	ownerId: string
): Promise<Doc<'accommodations'> | null> {
	const doc = await ctx.db.get(accommodationId);
	if (!doc || doc.ownerId !== ownerId) {
		return null;
	}
	return doc;
}
