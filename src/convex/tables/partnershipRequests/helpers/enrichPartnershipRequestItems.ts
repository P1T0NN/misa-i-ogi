// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';
import type { typesPartnershipRequestItem } from '@/features/partnerships/types/partnershipsTypes';

export async function enrichPartnershipRequestItems(
	ctx: QueryCtx,
	requests: Doc<'partnershipRequests'>[]
): Promise<typesPartnershipRequestItem[]> {
	if (requests.length === 0) return [];

	const accommodationIds = [...new Set(requests.map((r) => r.accommodationId))];
	const hospitalityIds = [...new Set(requests.map((r) => r.hospitalityId))];

	const [accommodations, hospitalities] = await Promise.all([
		Promise.all(accommodationIds.map((id) => ctx.db.get(id))),
		Promise.all(hospitalityIds.map((id) => ctx.db.get(id)))
	]);

	const accommodationById = new Map(
		accommodations
			.filter((doc): doc is Doc<'accommodations'> => doc !== null)
			.map((doc) => [doc._id, doc] as const)
	);
	const hospitalityById = new Map(
		hospitalities
			.filter((doc): doc is Doc<'hospitalities'> => doc !== null)
			.map((doc) => [doc._id, doc] as const)
	);

	return requests.map((request) => ({
		requestId: request._id,
		status: request.status,
		requestedAt: request._creationTime,
		respondedAt: request.respondedAt ?? null,
		accommodationName: accommodationById.get(request.accommodationId)?.name ?? null,
		hospitalityName: hospitalityById.get(request.hospitalityId)?.name ?? null
	}));
}
