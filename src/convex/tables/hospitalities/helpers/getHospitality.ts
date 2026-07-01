// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';
import type { QueryCtx } from '@/convex/_generated/server';

/**
 * Loads a `hospitalities` row and returns the public-safe projection.
 * Missing or inactive rows → `null`.
 */
export async function getHospitalitySafe(
	ctx: QueryCtx,
	hospitalityId: Id<'hospitalities'>
): Promise<HospitalityDetailsSafe | null> {
	const h = await ctx.db.get(hospitalityId);

	if (!h?.isActive) return null;

	return {
		_id: h._id,
		name: h.name,
		type: h.type,
		address: h.address,
		city: h.city,
		country: h.country,
		description: h.description,
		contactPhone: h.contactPhone,
		coverImageUrl: h.coverImageUrl,
		latitude: h.latitude,
		longitude: h.longitude
	};
}
