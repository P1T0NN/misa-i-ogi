// TYPES
import type { Doc } from '@/convex/_generated/dataModel';

/** Union of all accommodation kinds, derived from the schema so it stays in sync. */
export type AccommodationType = Doc<'accommodations'>['type'];

/** Guest-facing accommodation projection. Never expose the QR activation secret (`scanToken`). */
export type AccommodationStayDetailsSafe = Omit<
	Doc<'accommodations'>,
	'ownerId' | 'coverImageKey' | 'isActive' | '_creationTime' | 'scanToken'
>;

/** Header stats across the owner's full accommodation portfolio (not just the current page). */
export type MyAccommodationsSummary = {
	totalCount: number;
	activeCount: number;
	activePartnershipsCount: number;
};
