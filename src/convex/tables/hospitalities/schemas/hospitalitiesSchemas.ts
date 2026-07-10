// LIBRARIES
import { v } from 'convex/values';

/** Field validators for `hospitalities`. See {@link accommodationFields} in accommodations schemas. */
export const hospitalityFields = {
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

	/**
	 * Ordered gallery — `images[0]` is ALWAYS the cover (no separate cover column).
	 * Each entry caches the R2 `{ key, url }` so reads never touch storage. Optional
	 * so pre-existing rows validate; `backfillHospitalityImagesInternal` moves the
	 * legacy `coverImageKey`/`coverImageUrl` into `images[0]` and both create paths
	 * write it going forward. Clients read `images[0].url` for the cover — there is
	 * no `coverImageUrl` field anywhere (stored or projected).
	 */
	images: v.optional(v.array(v.object({ key: v.string(), url: v.string() }))),

	/**
	 * Who created the row: `platform` = admin `createHospitality`, `user` =
	 * self-service `createUserHospitality`. Optional so pre-existing rows
	 * validate; `backfillHospitalityCreateTypeInternal` sets them and code
	 * treats missing as `platform`.
	 */
	createType: v.optional(v.union(v.literal('platform'), v.literal('user'))),
	/**
	 * Guest-facing offer label. For platform venues it is shown to every
	 * accommodation; for user venues it is stored on the row and the live guest
	 * offer comes from the custom partnership when linked.
	 */
	benefit: v.string(),
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
};
