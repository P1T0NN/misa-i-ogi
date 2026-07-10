// LIBRARIES
import { pick } from 'convex-helpers';
import { v } from 'convex/values';

// HELPERS
import { createProjection } from '@/convex/helpers/createProjection';

// SCHEMA
import { hospitalityFields } from '@/convex/tables/hospitalities/schemas/hospitalitiesSchemas';
import { partnershipFields } from '@/convex/tables/partnerships/schemas/partnershipsSchemas';

/** Guest-facing partnership offer label — `benefit` only, no join secrets. */
export const partnershipBenefitSafe = createProjection({
	...pick(partnershipFields, ['benefit'])
});

export const partnershipMyItemValidator = v.object({
	partnershipId: v.id('partnerships'),
	accommodationName: v.string(),
	hospitalityName: v.string(),
	hospitalityType: hospitalityFields.type,
	hospitalityCity: v.string(),
	benefit: v.string(),
	isOwnHospitality: v.boolean(),
	createdAt: v.number()
});

/**
 * The venue fields shown on a stay's perks list — a card, not the full detail page.
 * `images[0]` is the cover — clients read `images[0].url`.
 */
export const partnershipScanHospitalitySafe = createProjection({
	_id: v.id('hospitalities'),
	...pick(hospitalityFields, ['name', 'type', 'city', 'latitude', 'longitude', 'images'])
});

export const partnershipAccommodationSafeValidator = v.object({
	benefit: partnershipFields.benefit,
	hospitality: partnershipScanHospitalitySafe.validator
});
