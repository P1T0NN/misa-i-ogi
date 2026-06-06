// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getAccommodationsByIds(
	ctx: QueryCtx,
	accommodationIds: Id<'accommodations'>[]
): Promise<Doc<'accommodations'>[]> {
	const docs = await Promise.all(accommodationIds.map((id) => ctx.db.get(id)));
	return docs.filter((doc): doc is Doc<'accommodations'> => doc !== null);
}
