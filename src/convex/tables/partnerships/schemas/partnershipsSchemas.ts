// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `partnerships` — join rows linking accommodations to partner venues.
 */
export const partnershipFields = {
	accommodationId: v.id('accommodations'),
	/** Denormalized from `accommodations.scanToken` at create time for admin preview / QR links. */
	accommodationScanToken: v.string(),
	/**
	 * Denormalized from `accommodations.ownerId` — an owner's active-partnerships list is
	 * the union of "links on my accommodations" and "links on my venues", and without
	 * these an owner-scoped read has to scan their entities first. Ownership is immutable
	 * on both tables (see `updateAccommodation` / `updateHospitality`), so these never go
	 * stale. Optional so legacy rows validate; `backfillPartnershipOwnerIds` fills them.
	 */
	accommodationOwnerId: v.optional(v.string()),
	hospitalityId: v.id('hospitalities'),
	/** Denormalized from `hospitalities.ownerId`. See `accommodationOwnerId`. */
	hospitalityOwnerId: v.optional(v.string()),

	benefit: v.string(),

	/**
	 * Who created the link: `platform` = admin `createPartnership`, `custom` =
	 * self-service (`createCustomPartnership` / `acceptPartnershipRequest`).
	 * Drives trial-expiry deactivation — only `custom` rows are ever disabled.
	 * Optional so legacy rows validate; missing = `platform`.
	 */
	createType: v.optional(v.union(v.literal('platform'), v.literal('custom'))),
	/** Why an inactive row was disabled — lets a future Pro upgrade reactivate precisely. */
	deactivationReason: v.optional(v.literal('trial_expired')),

	isActive: v.boolean()
};
