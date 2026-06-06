// HELPERS
import { analytics } from '@/convex/analytics';
import { uniqueIds } from '@/convex/helpers/uniqueIds';
import { getHospitalitiesByIds } from '@/convex/tables/hospitalities/helpers/getHospitalitiesByIds';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getTopHospitalityNamesByAccommodation(
	ctx: QueryCtx,
	accommodationIds: Id<'accommodations'>[]
): Promise<Map<Id<'accommodations'>, string>> {
	const topHospitalityIds = await Promise.all(
		accommodationIds.map((accommodationId) =>
			analytics.fetchTopDimensionValue(ctx, {
				metric: 'newReservations',
				scope: { type: 'resource', resourceType: 'accommodation', id: accommodationId },
				dimensionKey: 'hospitalityId'
			})
		)
	);

	const uniqueHospitalityIds = uniqueIds(
		topHospitalityIds.filter((id): id is Id<'hospitalities'> => Boolean(id))
	);
	const hospitalities = await getHospitalitiesByIds(ctx, uniqueHospitalityIds);
	const hospitalityById = new Map(
		hospitalities.map((hospitality) => [hospitality._id, hospitality])
	);

	return new Map(
		accommodationIds.map((accommodationId, index) => {
			const hospitalityId = topHospitalityIds[index] as Id<'hospitalities'> | null;
			const hospitality = hospitalityId ? hospitalityById.get(hospitalityId) : undefined;

			return [accommodationId, hospitality?.name ?? '-'];
		})
	);
}
