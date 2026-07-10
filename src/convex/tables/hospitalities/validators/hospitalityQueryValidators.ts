// LIBRARIES
import { pick } from 'convex-helpers';
import { v } from 'convex/values';

// HELPERS
import { createProjection } from '@/convex/helpers/createProjection';

// SCHEMA
import { hospitalityFields } from '@/convex/tables/hospitalities/schemas/hospitalitiesSchemas';
import { reservationFields } from '@/convex/tables/reservations/schemas/reservationsSchemas';

/**
 * Public-safe `hospitalities` projection for the guest venue page. Notably excludes
 * `connectCode` (whoever holds it can request a partnership), `ownerId`, and the
 * lifecycle columns. `images[0]` is the cover — clients read `images[0].url`.
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
		'images',
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

/** Owner-scoped hospitality row for the edit form. `images[0]` is the cover. */
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
		'images',
		'menuFileUrl',
		'menuLink'
	])
});

/**
 * Admin edit projection — the owner edit fields PLUS the admin-only levers
 * (`benefit` guest offer, `createType` platform/custom) so the admin edit form can
 * prefill them. Never returned to owners (guarded by `requireAdmin` in the query).
 */
export const hospitalityForAdminEdit = createProjection({
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
		'images',
		'menuFileUrl',
		'menuLink',
		'benefit',
		'createType'
	])
});
