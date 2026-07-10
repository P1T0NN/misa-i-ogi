// HELPERS
import { getHospitalitiesByIds } from '@/convex/tables/hospitalities/helpers/getHospitalitiesByIds';

// VALIDATORS
import { partnershipScanHospitalitySafe } from '@/convex/tables/partnerships/validators/partnershipQueryValidators';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';
import type { PartnershipAccommodationSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

/** Active custom partnership rows for one stay — small bounded set. */
export async function getCustomPartnershipsForStaySafe(
	ctx: QueryCtx,
	accommodationId: Id<'accommodations'>
): Promise<PartnershipAccommodationSafe[]> {
	const explicit = await ctx.db
		.query('partnerships')
		.withIndex('by_accommodation_active', (q) =>
			q.eq('accommodationId', accommodationId).eq('isActive', true)
		)
		.collect();

	const customPartnerships = explicit.filter((partnership) => partnership.createType === 'custom');
	const customHospitalities = await getHospitalitiesByIds(
		ctx,
		customPartnerships.map((partnership) => partnership.hospitalityId)
	);
	const customHospitalityById = new Map(
		customHospitalities
			.filter((hospitality) => hospitality.isActive)
			.map((h) => [h._id, h] as const)
	);

	const items: PartnershipAccommodationSafe[] = [];
	for (const partnership of customPartnerships) {
		const hospitality = customHospitalityById.get(partnership.hospitalityId);
		if (!hospitality) continue;
		items.push({
			benefit: partnership.benefit,
			hospitality: partnershipScanHospitalitySafe.project(hospitality)
		});
	}

	return items.sort((a, b) => a.hospitality.name.localeCompare(b.hospitality.name));
}
