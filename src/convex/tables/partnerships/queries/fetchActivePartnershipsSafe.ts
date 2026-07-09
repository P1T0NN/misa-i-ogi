// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';

// VALIDATORS
import { partnershipMyItemValidator } from '@/convex/tables/partnerships/validators/partnershipQueryValidators';

/**
 * Active custom partnerships for the signed-in owner — the union of links on the
 * accommodations they own and links on the venues they own. Both owner ids are
 * denormalized onto `partnerships`, so each access path is one index range: two merged
 * streams, O(per page) reads at any table size, no `.collect()`. Rows reachable both
 * ways (owner of both sides) are deduped by the factory.
 *
 * `createType` sits in both indexes, so platform links are excluded by the index bound
 * rather than filtered out afterwards — they render from `fetchActivePlatformHospitalities`.
 */
export const fetchActivePartnershipsSafe = fetchOptimized({
	table: 'partnerships',
	auth: 'user',
	strategy: 'cursor',
	// Projects away `accommodationScanToken` (the QR secret) — enforced server-side.
	rowValidator: partnershipMyItemValidator,
	union: async (ctx) => {
		const userId = await requireAuthUserId(ctx);

		return {
			specs: [
				{
					index: 'by_accommodation_owner_active_type' as const,
					eq: { accommodationOwnerId: userId, isActive: true, createType: 'custom' as const }
				},
				{
					index: 'by_hospitality_owner_active_type' as const,
					eq: { hospitalityOwnerId: userId, isActive: true, createType: 'custom' as const }
				}
			]
		};
	},
	enrich: async (ctx, page) => {
		const userId = await requireAuthUserId(ctx);

		const accommodationIds = [...new Set(page.map((p) => p.accommodationId))];
		const hospitalityIds = [...new Set(page.map((p) => p.hospitalityId))];

		const [accommodationDocs, hospitalityDocs] = await Promise.all([
			Promise.all(accommodationIds.map((id) => ctx.db.get(id))),
			Promise.all(hospitalityIds.map((id) => ctx.db.get(id)))
		]);

		const accommodationsById = new Map(
			accommodationDocs.filter((doc) => doc !== null).map((doc) => [doc._id, doc] as const)
		);
		const hospitalitiesById = new Map(
			hospitalityDocs.filter((doc) => doc !== null).map((doc) => [doc._id, doc] as const)
		);

		// ponytail: the only rows dropped here are ones whose accommodation or hospitality
		// vanished — impossible because deleting a venue is blocked while it has an active
		// partnership and otherwise cascade-deletes its partnership rows (see
		// cascadeAccommodationChildren / cascadeHospitalityChildren).
		// A short page is harmless in cursor mode; isDone/continueCursor come from the stream.
		return page.flatMap((partnership) => {
			const accommodation = accommodationsById.get(partnership.accommodationId);
			const hospitality = hospitalitiesById.get(partnership.hospitalityId);
			if (!accommodation || !hospitality) return [];

			return [
				{
					partnershipId: partnership._id,
					accommodationName: accommodation.name,
					hospitalityName: hospitality.name,
					hospitalityType: hospitality.type,
					hospitalityCity: hospitality.city,
					benefit: partnership.benefit,
					isOwnHospitality: hospitality.ownerId === userId,
					createdAt: partnership._creationTime
				}
			];
		});
	}
});
