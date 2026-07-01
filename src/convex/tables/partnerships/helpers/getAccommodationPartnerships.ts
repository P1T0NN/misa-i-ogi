// HELPERS
import { getAccommodationByIdSafe } from '@/convex/tables/accommodations/helpers/getAccommodationByIdSafe';
import { getHospitalitySafe } from '@/convex/tables/hospitalities/helpers/getHospitality';

// TYPES
import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Returns the active accommodation partnership for a hospitality, when one exists. */
export async function getActiveAccommodationHospitalityPartnership(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	hospitalityId: Id<'hospitalities'>
): Promise<Doc<'partnerships'> | null> {
	const partnership = await ctx.db
		.query('partnerships')
		.withIndex('by_pair', (q) =>
			q.eq('accommodationId', accommodationId).eq('hospitalityId', hospitalityId)
		)
		.first();

	if (!partnership?.isActive) return null;

	return partnership;
}

/** Returns whether an active accommodation ↔ hospitality partnership exists. */
export async function hasActiveAccommodationHospitalityPartnership(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	hospitalityId: Id<'hospitalities'>
): Promise<boolean> {
	const partnership = await getActiveAccommodationHospitalityPartnership(
		ctx,
		accommodationId,
		hospitalityId
	);

	return partnership !== null;
}

/**
 * Active partnerships for a stay, each enriched with a public-safe hospitality
 * projection. Missing/inactive stay → `[]`.
 */
export async function getAccommodationPartnershipsByAccommodationIdSafe(
	ctx: QueryCtx,
	accommodationId: Id<'accommodations'>
): Promise<AccommodationPartnershipSafe[]> {
	const accommodation = await getAccommodationByIdSafe(ctx, accommodationId);
	if (!accommodation) return [];

	const partnerships = await ctx.db
		.query('partnerships')
		.withIndex('by_accommodation', (q) => q.eq('accommodationId', accommodation._id))
		.collect();

	const enriched = await Promise.all(
		partnerships
			.filter((partnership) => partnership.isActive)
			.map(async (partnership): Promise<AccommodationPartnershipSafe | null> => {
				const hospitality = await getHospitalitySafe(ctx, partnership.hospitalityId);
				if (!hospitality) return null;

				return {
					_id: partnership._id,
					benefit: partnership.benefit,
					discountPercentage: partnership.discountPercentage,
					hospitality: {
						_id: hospitality._id,
						name: hospitality.name,
						type: hospitality.type,
						city: hospitality.city,
						coverImageUrl: hospitality.coverImageUrl,
						latitude: hospitality.latitude,
						longitude: hospitality.longitude
					}
				};
			})
	);

	return enriched
		.filter((row): row is AccommodationPartnershipSafe => row !== null)
		.sort((a, b) => a.hospitality.name.localeCompare(b.hospitality.name));
}
