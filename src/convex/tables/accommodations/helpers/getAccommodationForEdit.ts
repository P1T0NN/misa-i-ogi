// HELPERS
import { isAdminUser } from '@/convex/auth/helpers/isAdminUser';

// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Owner or admin may load an accommodation for the edit form. */
export async function getAccommodationForEdit(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	userId: string
): Promise<Doc<'accommodations'> | null> {
	const doc = await ctx.db.get(accommodationId);
	if (!doc) return null;
	if (doc.ownerId === userId) return doc;
	if (await isAdminUser(ctx)) return doc;
	return null;
}
