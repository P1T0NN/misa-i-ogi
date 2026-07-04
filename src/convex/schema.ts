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
		// Just the street number (e.g. "10"), kept alongside the full `address` so edit
		// forms can rehydrate the separate number input. Optional for legacy rows.
		addressNumber: v.optional(v.string()),
		// Map pin. Optional so existing rows validate; add/edit forms require them
		// going forward (filled by Places autocomplete).
		latitude: v.optional(v.number()),
		longitude: v.optional(v.number()),
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
		// Just the street number (e.g. "10"), kept alongside the full `address` so edit
		// forms can rehydrate the separate number input. Optional for legacy rows.
		addressNumber: v.optional(v.string()),
		// Map pin. Optional so existing rows validate; add/edit forms require them
		// going forward (filled by Places autocomplete).
		latitude: v.optional(v.number()),
		longitude: v.optional(v.number()),
		description: v.string(),

		contactPhone: v.string(),
		/** Reservation requests are managed in-app for every venue. */
		reservationMode: v.literal('managed_request'),

		ownerId: v.string(),

		coverImageKey: v.optional(v.string()),
		coverImageUrl: v.optional(v.string()),

		/**
		 * Who created the row: `platform` = admin `createHospitality`, `user` =
		 * self-service `createUserHospitality`. Optional so pre-existing rows
		 * validate; `backfillHospitalityCreateTypeInternal` sets them and code
		 * treats missing as `platform`.
		 */
		createType: v.optional(v.union(v.literal('platform'), v.literal('user'))),
		/**
		 * Whether *other* users can pick this venue in the custom-partnership
		 * connect flow. Admin-toggled only (`setHospitalityVisibility`) — owners
		 * never get this lever. Missing = `public` (all legacy rows are
		 * admin-created); user-created rows are born `private`.
		 */
		visibility: v.optional(v.union(v.literal('private'), v.literal('public'))),

		/**
		 * Short shareable code (see `connectCode.ts`) an owner hands out so an
		 * accommodation owner can request a custom partnership without browsing a
		 * venue pool. Unique across active rows. Optional so legacy rows validate;
		 * `backfillHospitalityConnectCodeInternal` fills them and both create paths
		 * mint one going forward.
		 */
		connectCode: v.optional(v.string()),

		/**
		 * Optional menu the owner uploads (image OR PDF — R2 allows both). `Key` is
		 * the R2 object key; `Url` is the resolved public URL shown to guests. Both
		 * unset when no menu file was provided.
		 */
		menuFileKey: v.optional(v.string()),
		menuFileUrl: v.optional(v.string()),
		/** Optional external menu link (owner's own online menu). Independent of the file. */
		menuLink: v.optional(v.string()),

		/**
		 * Why an inactive row was disabled — mirrors `partnerships`. Stamped by the
		 * pro-trial expiry cron on `user`-created venues; `updateHospitality`
		 * refuses to re-activate while it's set (unless the owner went Pro).
		 */
		deactivationReason: v.optional(v.literal('trial_expired')),

		isActive: v.boolean()
	})
		.index('by_owner', ['ownerId'])
		.index('by_city', ['city'])
		.index('by_type', ['type'])
		.index('by_name', ['name'])
		.index('by_visibility', ['visibility'])
		.index('by_connect_code', ['connectCode']),

	/**
	 * Join row linking an accommodation to a partner hospitality. One
	 * accommodation has many partnerships (one per venue) and one hospitality
	 * serves many accommodations. `benefit` is the short guest-facing offer label.
	 * Legacy rows may still have `discountPercentage`. `isActive` disables a link
	 * without deleting history.
	 */
	partnerships: defineTable({
		accommodationId: v.id('accommodations'),
		/** Denormalized from `accommodations.scanToken` at create time for admin preview / QR links. */
		accommodationScanToken: v.string(),
		hospitalityId: v.id('hospitalities'),

		benefit: v.optional(v.string()),
		discountPercentage: v.optional(v.number()),

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
	})
		.index('by_accommodation', ['accommodationId'])
		.index('by_hospitality', ['hospitalityId'])
		.index('by_accommodation_active', ['accommodationId', 'isActive'])
		.index('by_hospitality_active', ['hospitalityId', 'isActive'])
		.index('by_pair', ['accommodationId', 'hospitalityId']),

	/**
	 * Pending cross-owner partnership requests — a queue, not the source of
	 * truth for active links. When an accommodation owner connects to a
	 * hospitality they don't own, a row lands here; the hospitality owner
	 * accepts (inserts a real `partnerships` row in the same transaction) or
	 * declines. `partnerships` consumers never see pending state.
	 */
	partnershipRequests: defineTable({
		accommodationId: v.id('accommodations'),
		/** Denormalized — "my sent requests" query. */
		accommodationOwnerId: v.string(),
		hospitalityId: v.id('hospitalities'),
		/** Denormalized — "my received requests" query. */
		hospitalityOwnerId: v.string(),
		status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('declined')),
		/** Guest-facing offer — set by the hospitality owner on accept, never by the requester. */
		benefit: v.optional(v.string()),
		respondedAt: v.optional(v.number())
	})
		.index('by_accommodation', ['accommodationId'])
		.index('by_hospitality', ['hospitalityId'])
		.index('by_hospitality_owner_status', ['hospitalityOwnerId', 'status'])
		.index('by_accommodation_owner_status', ['accommodationOwnerId', 'status'])
		.index('by_pair', ['accommodationId', 'hospitalityId']),

	/**
	 * THE account-level free trial — one row per user who ever started it, never
	 * deleted (one trial per account, forever). Every Pro-gated feature reads
	 * this single row: custom partnerships (auto-starts it on first activation)
	 * and self-service hospitality creation (explicit "Start free trial" button).
	 * Effectively "the user's trial columns" — a satellite table because
	 * better-auth owns `users` and the expiry cron needs the `endsAt` index.
	 * `endsAt` is the scheduled deadline (set at creation). `expiredAt` is
	 * stamped by the expiry cron when it actually handles the expiry
	 * (deactivated the user's custom partnerships and user-created venues, or
	 * skipped because they're Pro) — its absence is what marks a trial as still
	 * needing that sweep.
	 */
	proTrials: defineTable({
		/** better-auth user id. */
		userId: v.string(),
		/** Scheduled end of the trial — creation time + the trial duration. */
		endsAt: v.number(),
		/** When the expiry cron swept this trial; unset = not yet handled. */
		expiredAt: v.optional(v.number())
	})
		.index('by_user', ['userId'])
		// Cron scan: unswept (missing `expiredAt` sorts first) + due by time.
		.index('by_expired_ends', ['expiredAt', 'endsAt']),

	/**
	 * Anonymous guest session after scanning the in-room QR. Browsers hold signed
	 * HttpOnly bearer grants; only activation and sharing-code hashes are stored here.
	 */
	guests: defineTable({
		sessionTokenHash: v.string(),
		sharingCodeHash: v.string(),
		accommodationId: v.id('accommodations'),
		expiresAt: v.number(),
		createdAt: v.number(),
		lastSeenAt: v.number()
	})
		.index('by_session_token_hash', ['sessionTokenHash'])
		.index('by_sharing_code_hash', ['sharingCodeHash'])
		.index('by_accommodation', ['accommodationId']),

	/**
	 * Reservation requests submitted by guests on hospitality pages. Each
	 * reservation links a guest to a hospitality venue. Owners review and
	 * confirm/cancel requests; analytics later join on `guestId`.
	 */
	reservations: defineTable({
		hospitalityId: v.id('hospitalities'),
		/** Denormalized from `hospitalities.name` for owner-facing reservation lists. */
		hospitalityName: v.string(),
		/** Denormalized from `hospitalities.ownerId` for efficient owner-scoped dashboards. */
		hospitalityOwnerId: v.string(),
		guestId: v.id('guests'),
		accommodationId: v.id('accommodations'),

		guestName: v.string(),
		/** Optional — guests may submit a reservation with phone only. */
		email: v.optional(v.string()),
		phone: v.string(),
		/** Party size submitted with the reservation request. */
		guestCount: v.number(),
		/** Guest-chosen time slot ("HH:mm" in 24h format). */
		requestedTime: v.string(),

		status: v.union(
			v.literal('pending'),
			v.literal('confirmed'),
			v.literal('cancelled'),
			v.literal('no_show')
		)
	})
		.index('by_hospitality', ['hospitalityId'])
		.index('by_hospitality_owner', ['hospitalityOwnerId'])
		.index('by_hospitality_owner_status', ['hospitalityOwnerId', 'status'])
		.index('by_guest', ['guestId'])
		.index('by_accommodation', ['accommodationId'])
		.index('by_status', ['status']),

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
