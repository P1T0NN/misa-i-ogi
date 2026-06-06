// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getHospitalitiesByIds(
	ctx: QueryCtx,
	hospitalityIds: Id<'hospitalities'>[]
): Promise<Doc<'hospitalities'>[]> {
	const docs = await Promise.all(hospitalityIds.map((id) => ctx.db.get(id)));
	return docs.filter((doc): doc is Doc<'hospitalities'> => doc !== null);
}
