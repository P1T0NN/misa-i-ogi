// HELPERS
import { isAdminUser } from '@/convex/auth/helpers/isAdminUser';

// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Owner or admin may load a hospitality for the edit form. */
export async function getHospitalityForEdit(
	ctx: QueryCtx | MutationCtx,
	hospitalityId: Id<'hospitalities'>,
	userId: string
): Promise<Doc<'hospitalities'> | null> {
	const doc = await ctx.db.get(hospitalityId);
	if (!doc) return null;
	if (doc.ownerId === userId) return doc;
	if (await isAdminUser(ctx)) return doc;
	return null;
}
