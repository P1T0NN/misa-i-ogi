// TYPES
import type { Doc } from '@/convex/_generated/dataModel';

/** Union of all hospitality kinds — derived from the schema so it stays in sync. */
export type HospitalityType = Doc<'hospitalities'>['type'];

/** Public-safe `hospitalities` doc — strips owner, storage key, lifecycle, and system metadata. */
export type HospitalityDetailsSafe = Omit<Doc<'hospitalities'>, 'ownerId' | 'coverImageKey' | 'isActive' | '_creationTime'>;

/** Header stats across the owner's full hospitality portfolio (not just the current page). */
export type MyHospitalitiesSummary = {
	totalCount: number;
	activeCount: number;
	activePartnershipsCount: number;
};
