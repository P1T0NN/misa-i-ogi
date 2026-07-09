// LIBRARIES
import { pick } from 'convex-helpers';
import { v } from 'convex/values';

// HELPERS
import { createProjection } from '@/convex/helpers/createProjection';

// SCHEMA
import { hospitalityFields } from '@/convex/tables/hospitalities/schemas/hospitalitiesSchemas';
import { partnershipFields } from '@/convex/tables/partnerships/schemas/partnershipsSchemas';

// VALIDATORS
import { hospitalityTypeValidator } from '@/convex/tables/hospitalities/validators/hospitalityQueryValidators';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { PartnershipAccommodationSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

/** Guest-facing partnership offer label — `benefit` only, no join secrets. */
export const partnershipBenefitSafe = createProjection({
	...pick(partnershipFields, ['benefit'])
});

export const partnershipMyItemValidator = v.object({
	partnershipId: v.id('partnerships'),
	accommodationName: v.string(),
	hospitalityName: v.string(),
	hospitalityType: hospitalityTypeValidator,
	hospitalityCity: v.string(),
	benefit: v.string(),
	isOwnHospitality: v.boolean(),
	createdAt: v.number()
});

/** The venue fields shown on a stay's perks list — a card, not the full detail page. */
export const partnershipScanHospitalitySafe = createProjection({
	_id: v.id('hospitalities'),
	...pick(hospitalityFields, ['name', 'type', 'city', 'coverImageUrl', 'latitude', 'longitude'])
});

export const partnershipAccommodationSafeValidator = v.object({
	benefit: partnershipFields.benefit,
	hospitality: partnershipScanHospitalitySafe.validator
});

/** Join a partnership row with its venue for the stay perks list. */
export function projectPartnershipAccommodationSafe(
	partnership: Pick<Doc<'partnerships'>, 'benefit'>,
	hospitality: Doc<'hospitalities'>
): PartnershipAccommodationSafe {
	return {
		benefit: partnership.benefit,
		hospitality: partnershipScanHospitalitySafe.project(hospitality)
	};
}
