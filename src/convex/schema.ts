// LIBRARIES
import { defineSchema, defineTable } from 'convex/server';

// TABLES
import { auditLogTable } from './tables/auditLog/schemas/auditLogSchema';
import { accommodationFields } from './tables/accommodations/schemas/accommodationsSchemas';
import { guestFields } from './tables/guests/schemas/guestsSchemas';
import { hospitalityFields } from './tables/hospitalities/schemas/hospitalitiesSchemas';
import { partnershipRequestFields } from './tables/partnershipRequests/schemas/partnershipRequestsSchemas';
import { partnershipFields } from './tables/partnerships/schemas/partnershipsSchemas';
import { proTrialFields } from './tables/proTrials/schemas/proTrialsSchemas';
import { reportFields } from './tables/reports/schemas/reportsSchemas';
import { reservationFields } from './tables/reservations/schemas/reservationsSchemas';
import { uploadedFilesR2Fields } from './storage/r2/schemas/uploadedFilesR2Schemas';

const schema = defineSchema({
	// Users (with `role` and other custom fields) live in the better-auth component;
	// access via `authComponent.getAuthUser(ctx)`. Foreign-key columns below store the
	// better-auth user id as a plain string.

	// Audit logs — toggle population via FEATURES.AUDIT_LOGS in shared/config.ts.
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
	accommodations: defineTable(accommodationFields)
		.index('by_owner', ['ownerId'])
		.index('by_scan_token', ['scanToken'])
		.index('by_city', ['city'])
		.index('by_name', ['name'])
		.index('by_type', ['type'])
		.searchIndex('search_name', { searchField: 'name', filterFields: ['ownerId'] }),

	/**
	 * Restaurants, cafés, bars, night clubs, horse rides, spas, tours — the
	 * venues a guest visits after scanning the QR in their accommodation.
	 */
	hospitalities: defineTable(hospitalityFields)
		.index('by_owner', ['ownerId'])
		.index('by_city', ['city'])
		.index('by_type', ['type'])
		.index('by_name', ['name'])
		.index('by_connect_code', ['connectCode'])
		// Implicit platform partners: fetch every active platform venue in one indexed scan.
		.index('by_create_type_active', ['createType', 'isActive'])
		.searchIndex('search_name', { searchField: 'name', filterFields: ['ownerId'] }),

	/**
	 * Join row linking an accommodation to a partner hospitality. One
	 * accommodation has many partnerships (one per venue) and one hospitality
	 * serves many accommodations. `benefit` is the short guest-facing offer label.
	 * `isActive` disables a link without deleting history.
	 */
	partnerships: defineTable(partnershipFields)
		.index('by_accommodation', ['accommodationId'])
		.index('by_hospitality', ['hospitalityId'])
		.index('by_accommodation_active', ['accommodationId', 'isActive'])
		.index('by_hospitality_active', ['hospitalityId', 'isActive'])
		// The two access paths of `fetchActivePartnershipsSafe`'s union. `createType` is in the
		// index so platform rows are excluded by the index range, not by a post-scan filter.
		.index('by_accommodation_owner_active_type', ['accommodationOwnerId', 'isActive', 'createType'])
		.index('by_hospitality_owner_active_type', ['hospitalityOwnerId', 'isActive', 'createType'])
		.index('by_pair', ['accommodationId', 'hospitalityId']),

	/**
	 * Pending cross-owner partnership requests — a queue, not the source of
	 * truth for active links. When an accommodation owner connects to a
	 * hospitality they don't own, a row lands here; the hospitality owner
	 * accepts (inserts a real `partnerships` row in the same transaction) or
	 * declines. `partnerships` consumers never see pending state.
	 */
	partnershipRequests: defineTable(partnershipRequestFields)
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
	proTrials: defineTable(proTrialFields)
		.index('by_user', ['userId'])
		// Cron scan: unswept (missing `expiredAt` sorts first) + due by time.
		.index('by_expired_ends', ['expiredAt', 'endsAt']),

	/**
	 * Anonymous guest session after scanning the in-room QR. Browsers hold signed
	 * HttpOnly bearer grants; only activation and sharing-code hashes are stored here.
	 */
	guests: defineTable(guestFields)
		.index('by_session_token_hash', ['sessionTokenHash'])
		.index('by_sharing_code_hash', ['sharingCodeHash'])
		.index('by_accommodation_expires', ['accommodationId', 'expiresAt'])
		// Global expiry sweep (the daily cron) — the accommodation-scoped index above
		// can't serve a cross-accommodation "everything expired" scan.
		.index('by_expires', ['expiresAt']),

	/**
	 * Reservation requests submitted by guests on hospitality pages. Each
	 * reservation links a guest to a hospitality venue. Owners review and
	 * confirm/cancel requests; analytics later join on `guestId`.
	 */
	reservations: defineTable(reservationFields)
		.index('by_hospitality_owner_status', ['hospitalityOwnerId', 'status'])
		.index('by_hospitality_status', ['hospitalityId', 'status'])
		.index('by_guest_hospitality_status', ['guestId', 'hospitalityId', 'status'])
		.index('by_status', ['status']),

	/**
	 * User-submitted bug reports / ideas / feedback from the public `/report` page.
	 * Anonymous-friendly (userId optional), admin-read-only. Listed newest-first via
	 * the built-in `by_creation_time` — no custom index needed until filtering exists.
	 */
	reports: defineTable(reportFields),

	/** Cloudflare R2 file reference + cached download URL. Owner-stamped at upload. */
	uploadedFilesR2: defineTable(uploadedFilesR2Fields)
		.index('by_key', ['key'])
		.index('by_owner', ['ownerId'])
});

export default schema;
