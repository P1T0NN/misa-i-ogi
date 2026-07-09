// LIBRARIES
import { pick } from 'convex-helpers';
import { v } from 'convex/values';

// HELPERS
import { createProjection } from '@/convex/helpers/createProjection';

// SCHEMA
import { hospitalityFields } from '@/convex/tables/hospitalities/schemas/hospitalitiesSchemas';
import { reservationFields } from '@/convex/tables/reservations/schemas/reservationsSchemas';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { HospitalityGuestReservationSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/** The venue-kind union, taken straight off the schema so it can't drift from it. */
export const hospitalityTypeValidator = hospitalityFields.type;

/**
 * Public-safe `hospitalities` projection for the guest venue page. Notably excludes
 * `connectCode` (whoever holds it can request a partnership), `visibility`, `ownerId`,
 * the storage keys, and the lifecycle columns.
 */
export const hospitalityDetailsSafe = createProjection({
	_id: v.id('hospitalities'),
	...pick(hospitalityFields, [
		'name',
		'type',
		'address',
		'city',
		'country',
		'latitude',
		'longitude',
		'description',
		'benefit',
		'contactPhone',
		'coverImageUrl',
		'menuFileUrl',
		'menuLink'
	])
});

export const myHospitalitiesSummaryValidator = v.object({
	totalCount: v.number(),
	activeCount: v.number(),
	activePartnershipsCount: v.number()
});

/** Guest-facing reservation on a hospitality detail page — collapses DB status to pending/confirmed. */
export const hospitalityGuestReservationSafe = createProjection({
	...pick(reservationFields, ['guestName', 'email', 'phone', 'guestCount', 'requestedTime']),
	status: v.union(v.literal('pending'), v.literal('confirmed'))
});

export function projectHospitalityGuestReservation(
	doc: Doc<'reservations'>
): HospitalityGuestReservationSafe {
	return {
		...pick(doc, ['guestName', 'email', 'phone', 'guestCount', 'requestedTime']),
		status: doc.status === 'confirmed' ? 'confirmed' : 'pending'
	};
}

/** Owner-scoped hospitality row for the edit form. */
export const hospitalityForEdit = createProjection({
	_id: v.id('hospitalities'),
	...pick(hospitalityFields, [
		'name',
		'type',
		'address',
		'city',
		'country',
		'addressNumber',
		'latitude',
		'longitude',
		'description',
		'contactPhone',
		'reservationMode',
		'isActive',
		'coverImageUrl',
		'menuFileUrl',
		'menuLink'
	])
});
