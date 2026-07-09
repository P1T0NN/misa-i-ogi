// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `accommodations`, hoisted out of `defineTable` so audience-specific
 * projections can `pick` from them instead of re-declaring each field's validator.
 * See `helpers/createProjection.ts`.
 */
export const accommodationFields = {
	name: v.string(),
	type: v.union(
		v.literal('apartment'),
		v.literal('hotel'),
		v.literal('villa'),
		v.literal('hostel'),
		v.literal('other')
	),
	address: v.string(),
	city: v.string(),
	country: v.string(),
	// Just the street number (e.g. "10"), kept alongside the full `address` so edit
	// forms can rehydrate the separate number input. Optional for legacy rows.
	addressNumber: v.optional(v.string()),
	// Map pin. Optional so existing rows validate; add/edit forms require them
	// going forward (filled by Places autocomplete).
	latitude: v.optional(v.number()),
	longitude: v.optional(v.number()),

	ownerId: v.string(),

	coverImageKey: v.string(),
	coverImageUrl: v.string(),

	scanToken: v.string(),

	isActive: v.boolean()
};
