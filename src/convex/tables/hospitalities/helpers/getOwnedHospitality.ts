// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx, MutationCtx } from '@/convex/_generated/server';

/** Returns the row when it exists and belongs to `ownerId`; otherwise `null`. */
export async function getOwnedHospitality(
	ctx: QueryCtx | MutationCtx,
	hospitalityId: Id<'hospitalities'>,
	ownerId: string
): Promise<Doc<'hospitalities'> | null> {
	const doc = await ctx.db.get(hospitalityId);
	if (!doc || doc.ownerId !== ownerId) {
		return null;
	}
	return doc;
}
