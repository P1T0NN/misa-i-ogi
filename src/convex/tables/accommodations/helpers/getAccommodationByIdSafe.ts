// TYPES
import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

/**
 * Loads an active `accommodations` row by id and returns the public-safe projection.
 */
export async function getAccommodationByIdSafe(
	ctx: QueryCtx,
	accommodationId: Id<'accommodations'>
): Promise<AccommodationStayDetailsSafe | null> {
	const a = await ctx.db.get(accommodationId);
	if (!a?.isActive) return null;

	return {
		_id: a._id,
		name: a.name,
		type: a.type,
		address: a.address,
		city: a.city,
		country: a.country,
		description: a.description,
		coverImageUrl: a.coverImageUrl
	};
}
