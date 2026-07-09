// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';

/** Active partnership item on the owner `/partnerships` hub (names denormalized). */
export type typesPartnershipMyItem = {
	partnershipId: Id<'partnerships'>;
	createdAt: Doc<'partnerships'>['_creationTime'];
	benefit: string;
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
