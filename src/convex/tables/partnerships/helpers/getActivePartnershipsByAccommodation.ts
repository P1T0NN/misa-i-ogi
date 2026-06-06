// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getActivePartnershipsByAccommodation(
	ctx: QueryCtx,
	accommodationIds: Id<'accommodations'>[]
): Promise<Doc<'partnerships'>[][]> {
	return Promise.all(
		accommodationIds.map((id) =>
			ctx.db
				.query('partnerships')
				.withIndex('by_accommodation_active', (q) =>
					q.eq('accommodationId', id).eq('isActive', true)
				)
				.collect()
		)
	);
}
