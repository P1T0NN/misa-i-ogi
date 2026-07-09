// LIBRARIES
import { pick } from 'convex-helpers';
import { v } from 'convex/values';

// HELPERS
import { createProjection } from '@/convex/helpers/createProjection';

// SCHEMA
import { accommodationFields } from '@/convex/tables/accommodations/schemas/accommodationsSchemas';

/**
 * Guest-facing accommodation projection. Everything not listed here — `ownerId`,
 * `coverImageKey`, `isActive`, and above all `scanToken` (the QR activation secret) —
 * is unreachable from this shape, in the type and at runtime.
 */
export const accommodationStaySafe = createProjection({
	_id: v.id('accommodations'),
	...pick(accommodationFields, [
		'name',
		'type',
		'address',
		'city',
		'country',
		'latitude',
		'longitude',
		'coverImageUrl'
	])
});

export const myAccommodationsSummaryValidator = v.object({
	totalCount: v.number(),
	activeCount: v.number(),
	activePartnershipsCount: v.number()
});

/** Owner-scoped accommodation row for the edit form (includes `scanToken` for QR preview). */
export const accommodationForEdit = createProjection({
	_id: v.id('accommodations'),
	...pick(accommodationFields, [
		'name',
		'type',
		'address',
		'city',
		'country',
		'addressNumber',
		'latitude',
		'longitude',
		'isActive',
		'coverImageUrl',
		'scanToken'
	])
});
