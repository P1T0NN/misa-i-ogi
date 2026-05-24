// TYPES
import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';
import type { QueryCtx } from '@/convex/_generated/server';

/**
 * Loads an `accommodations` row by its QR-embedded `scanToken` and returns the
 * public-safe projection. Missing or inactive rows → `null`.
 *
 * Uses the `by_scan_token` index so the lookup is O(1) regardless of table size —
 * the QR scan must feel instant.
 */
export async function getAccommodationByScanTokenSafe(
	ctx: QueryCtx,
	scanToken: string
): Promise<AccommodationStayDetailsSafe | null> {
	const a = await ctx.db
		.query('accommodations')
		.withIndex('by_scan_token', (q) => q.eq('scanToken', scanToken))
		.unique();

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
