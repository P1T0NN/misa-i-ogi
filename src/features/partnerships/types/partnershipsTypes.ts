// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/** Public-safe hospitality fields shown on the guest scan perks list. */
export type typesPartnershipScanHospitalitySafe = Pick<
	HospitalityDetailsSafe,
	'_id' | 'name' | 'type' | 'city' | 'coverImageUrl' | 'latitude' | 'longitude'
>;

/** Active partnership for a stay, enriched with its partner venue. */
export type typesPartnershipAccommodationSafe = Pick<
	Doc<'partnerships'>,
	'_id' | 'benefit' | 'discountPercentage'
> & {
	hospitality: typesPartnershipScanHospitalitySafe;
};

/** Active partnership item on the owner `/partnerships` hub (names denormalized). */
export type typesPartnershipMyItem = {
	partnershipId: Id<'partnerships'>;
	createdAt: Doc<'partnerships'>['_creationTime'];
	benefit: string | null;
	isOwnHospitality: boolean;
	accommodationName: Doc<'accommodations'>['name'];
	hospitalityName: Doc<'hospitalities'>['name'];
	hospitalityType: Doc<'hospitalities'>['type'];
	hospitalityCity: Doc<'hospitalities'>['city'];
};

/** One item in the partnerships hub Sent/Received tabs. */
export type typesPartnershipRequestItem = Pick<Doc<'partnershipRequests'>, 'status'> & {
	requestId: Id<'partnershipRequests'>;
	requestedAt: Doc<'partnershipRequests'>['_creationTime'];
	respondedAt: NonNullable<Doc<'partnershipRequests'>['respondedAt']> | null;
	accommodationName: Doc<'accommodations'>['name'] | null;
	hospitalityName: Doc<'hospitalities'>['name'] | null;
};

export type typesPartnershipRequestsResult = {
	sent: typesPartnershipRequestItem[];
	received: typesPartnershipRequestItem[];
};
