// LIBRARIES
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// TABLES
import { auditLogTable } from './tables/auditLog/schemas/auditLogSchema';

const schema = defineSchema({
	// Users (with `role` and other custom fields) live in the better-auth component;
	// access via `authComponent.getAuthUser(ctx)`. Foreign-key columns below store the
	// better-auth user id as a plain string.

	// Audit logs — toggle population via FEATURES.AUDIT_LOGS in projectSettings.ts.
	// The table itself is always declared so flipping the flag needs no migration.
	auditLogs: auditLogTable,

	// Core domain — see ABOUT_COMPANY.md for the product flow.
	// `accommodations` ←→ `hospitalities` joined by `partnerships`. A guest scans a
	// QR (which encodes `accommodations.scanToken`) → `/activate/[token]` → `/stay`.

	/**
	 * Apartments / hotels / villas a guest sleeps in. `scanToken` is an opaque,
	 * auto-generated secret baked into the printed QR placed inside the unit; the
	 * guest perks page loads by token with no auth. Enforce uniqueness in create
	 * against `by_scan_token`.
	 *
	 * `coverImageKey` / `coverImageUrl` mirror `uploadedFilesR2` so the cover
	 * renders without an extra join.
	 */
	accommodations: defineTable({
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
		description: v.optional(v.string()),

		ownerId: v.string(),

		coverImageKey: v.string(),
		coverImageUrl: v.string(),

		scanToken: v.string(),

		isActive: v.boolean()
	})
		.index('by_owner', ['ownerId'])
		.index('by_scan_token', ['scanToken'])
		.index('by_city', ['city'])
		.index('by_name', ['name'])
		.index('by_type', ['type']),

	/**
	 * Restaurants, cafés, bars, night clubs, horse rides, spas, tours — the
	 * venues a guest visits after scanning the QR in their accommodation.
	 */
	hospitalities: defineTable({
		name: v.string(),
		type: v.union(
			v.literal('restaurant'),
			v.literal('cafe'),
			v.literal('bar'),
			v.literal('night_club'),
			v.literal('horse_ride'),
			v.literal('spa'),
			v.literal('tour'),
			v.literal('other')
		),
		address: v.string(),
		city: v.string(),
		country: v.string(),
		description: v.string(),

		contactPhone: v.string(),
		contactEmail: v.optional(v.string()),
		website: v.optional(v.string()),
		/** Enables Konak-hosted reservation requests that venue owners can accept or decline. */
		reservationRequestsEnabled: v.optional(v.boolean()),

		ownerId: v.string(),

		coverImageKey: v.optional(v.string()),
		coverImageUrl: v.optional(v.string()),

		isActive: v.boolean()
	})
		.index('by_owner', ['ownerId'])
		.index('by_city', ['city'])
		.index('by_type', ['type'])
		.index('by_name', ['name']),

	/**
	 * Join row linking an accommodation to a partner hospitality. One
	 * accommodation has many partnerships (one per venue) and one hospitality
	 * serves many accommodations. Optional `discountPercentage` when the perk is
	 * a percent-off offer. `isActive` disables a link without deleting history.
	 */
	partnerships: defineTable({
		accommodationId: v.id('accommodations'),
		/** Denormalized from `accommodations.scanToken` at create time for admin preview / QR links. */
		accommodationScanToken: v.string(),
		hospitalityId: v.id('hospitalities'),

		discountPercentage: v.optional(v.number()),

		isActive: v.boolean()
	})
		.index('by_accommodation', ['accommodationId'])
		.index('by_hospitality', ['hospitalityId'])
		.index('by_pair', ['accommodationId', 'hospitalityId']),

	/**
	 * Anonymous guest session after scanning the in-room QR. The browser holds the
	 * raw token in a signed HttpOnly cookie; only `sessionTokenHash` is stored here.
	 */
	guests: defineTable({
		sessionTokenHash: v.string(),
		accommodationId: v.id('accommodations'),
		expiresAt: v.number(),
		createdAt: v.number(),
		lastSeenAt: v.number()
	})
		.index('by_session_token_hash', ['sessionTokenHash'])
		.index('by_accommodation', ['accommodationId']),

	/** Cloudflare R2 file reference + cached download URL. Owner-stamped at upload. */
	uploadedFilesR2: defineTable({
		ownerId: v.string(),
		key: v.string(),
		url: v.string()
	})
		.index('by_key', ['key'])
		.index('by_owner', ['ownerId'])
});

export default schema;
