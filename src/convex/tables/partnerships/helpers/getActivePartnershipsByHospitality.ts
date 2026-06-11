// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getActivePartnershipsByHospitality(
	ctx: QueryCtx,
	hospitalityIds: Id<'hospitalities'>[]
): Promise<Doc<'partnerships'>[][]> {
	return Promise.all(
		hospitalityIds.map((id) =>
			ctx.db
				.query('partnerships')
				.withIndex('by_hospitality_active', (q) => q.eq('hospitalityId', id).eq('isActive', true))
				.collect()
		)
	);
}
