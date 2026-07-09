// VALIDATORS
import { accommodationStaySafe } from '@/convex/tables/accommodations/validators/accommodationQueryValidators';

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
	const accommodation = await ctx.db.get(accommodationId);
	if (!accommodation?.isActive) return null;

	return accommodationStaySafe.project(accommodation);
}
