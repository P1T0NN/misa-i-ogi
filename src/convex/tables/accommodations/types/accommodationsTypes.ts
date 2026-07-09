// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { ProjectionType } from '@/convex/helpers/createProjection';
import type { accommodationStaySafe } from '@/convex/tables/accommodations/validators/accommodationQueryValidators';

/** Union of all accommodation kinds, derived from the schema so it stays in sync. */
export type AccommodationType = Doc<'accommodations'>['type'];

/**
 * Guest-facing accommodation projection — the field list lives on `accommodationStaySafe`
 * so the type, the `returns` validator and the runtime projector can't disagree.
 * Never exposes the QR activation secret (`scanToken`).
 */
export type AccommodationStayDetailsSafe = ProjectionType<typeof accommodationStaySafe>;

/** Header stats across the owner's full accommodation portfolio (not just the current page). */
export type MyAccommodationsSummary = {
	totalCount: number;
	activeCount: number;
	activePartnershipsCount: number;
};
