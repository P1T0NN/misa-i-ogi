// HELPERS
import { analytics } from '@/convex/analytics';
import { uniqueIds } from '@/convex/helpers/uniqueIds';
import { getAccommodationsByIds } from '@/convex/tables/accommodations/helpers/getAccommodationsByIds';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getTopAccommodationNamesByHospitality(
	ctx: QueryCtx,
	hospitalityIds: Id<'hospitalities'>[]
): Promise<Map<Id<'hospitalities'>, string>> {
	const topAccommodationIds = await Promise.all(
		hospitalityIds.map((hospitalityId) =>
			analytics.fetchTopDimensionValue(ctx, {
				metric: 'newReservations',
				scope: { type: 'resource', resourceType: 'hospitality', id: hospitalityId },
				dimensionKey: 'accommodationId'
			})
		)
	);

	const uniqueAccommodationIds = uniqueIds(
		topAccommodationIds.filter((id): id is Id<'accommodations'> => Boolean(id))
	);
	const accommodations = await getAccommodationsByIds(ctx, uniqueAccommodationIds);
	const accommodationById = new Map(
		accommodations.map((accommodation) => [accommodation._id, accommodation])
	);

	return new Map(
		hospitalityIds.map((hospitalityId, index) => {
			const accommodationId = topAccommodationIds[index] as Id<'accommodations'> | null;
			const accommodation = accommodationId ? accommodationById.get(accommodationId) : undefined;

			return [hospitalityId, accommodation?.name ?? '-'];
		})
	);
}
