// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/** Public-safe hospitality fields shown on the guest scan perks list. */
export type ScanPartnershipHospitalitySafe = Pick<
	HospitalityDetailsSafe,
	'_id' | 'name' | 'type' | 'city' | 'coverImageUrl' | 'latitude' | 'longitude'
>;

/** Active partnership for a stay, enriched with its partner venue. */
export type AccommodationPartnershipSafe = Pick<
	Doc<'partnerships'>,
	'_id' | 'benefit' | 'discountPercentage'
> & {
	hospitality: ScanPartnershipHospitalitySafe;
};
