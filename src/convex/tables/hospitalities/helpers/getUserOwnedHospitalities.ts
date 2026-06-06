// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getUserOwnedHospitalities(
	ctx: QueryCtx,
	userId: string
): Promise<Doc<'hospitalities'>[]> {
	return ctx.db
		.query('hospitalities')
		.withIndex('by_owner', (q) => q.eq('ownerId', userId))
		.collect();
}
