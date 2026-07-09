# Production TODOs — Launch Gate

**This file is the launch gate.** When every task in **Section A (Blockers)** is done and the
**Section B (Deploy Runbook)** has been executed, the app ships. Sections C and D are
post-launch work — do NOT let them delay the launch, but do not delete them either.

## Implementation status (updated 2026-07-09, after adversarial re-review)

Full verify suite green: `bun run format` clean · `bun run lint` exits 0 ·
`bun run check` 0 errors · `bun run build` succeeds (on `@sveltejs/adapter-vercel`).

- ✅ **DONE (code):** A2, A3 (parts 1–2), A4, A5, A7, A8, A9, A11, A12, A13, A14, A15.
- ⏸️ **DEFERRED by owner (not in production yet):** A1 (Resend sender), A6 (Sentry),
  A10 (contact form), A3 **part 3** (backfill-migration extension), and all of
  Section B env/secret/migration ops.

**Adversarial re-review of the implementation (2026-07-09) — findings and resolutions:**

1. FIXED — `guestTokenMint` was keyed per IP at 60/min·cap 20, but the 5-min guest JWT TTL
   plus tab-focus/bfcache refreshes means dozens of hotel guests behind one NAT IP would
   intermittently lock each other out of the stay page. Now a dedicated preset
   (300/min · cap 100 per IP) — generous for shared WiFi, still bounds a hostile IP.
2. FIXED — venue-cascade helpers now also delete pending `partnershipRequests` rows
   (`by_accommodation` / `by_hospitality`), which would otherwise linger forever in both
   owners' Sent/Received tabs after a venue delete.
3. CORRECTED — the A9 premise was misdiagnosed: bits-ui's AlertDialog.Action never
   auto-closed (verified in bits-ui source — no onclick on DialogActionState; only
   Cancel/Close have one). The dialog always stayed open during the await. The shipped
   change is still a net improvement (spinner now renders even when callers don't pass
   `isPending`, plus a double-fire guard) and the misleading `preventDefault()` +
   comment were removed. The earlier "manual browser check" caveat is void.
4. FIXED (owner requested, 2026-07-09) — deleting a guest row now system-cancels their
   still-PENDING reservations via
   `src/convex/tables/reservations/helpers/cancelPendingReservationsForGuest.ts`, wired
   into all three deletion sites (expiry cron, `createGuest` lazy cleanup, accommodation
   cascade). Mirrors `cancelReservation`'s counter/audit/analytics shape with
   `reason: 'guest_expired'`. Terminal reservations are untouched — they remain the
   venue owner's history with the guest's name/phone denormalized.

- ⚠️ **Note:** stripped a UTF-8 BOM from `vercel.json` (it broke the Vercel adapter's
  JSON parse — would have broken real Vercel deploys too).
- ⚠️ **A3 residual:** the per-owner counter drift that already happened in dev is NOT
  repairable until A3 part 3 (backfill extension) is done. New deletes are now correct.

**Instructions for the implementing model/agent:**

- Work through Section A top to bottom. Tasks are ordered by dependency and severity.
- Every task lists the exact files, the existing helpers to reuse, and a verification step.
  Reuse the named helpers — do NOT invent parallel abstractions. This codebase already has
  factories/helpers for deletes, counters, rate limits, audit, and i18n; the bugs below are
  almost all "one existing pattern wasn't applied in one place".
- After each backend task: `bun run check` must stay at 0 errors.
- After ALL tasks: `bun run format`, then `bun run lint` must exit 0, then `bun run build`
  must succeed.
- Convention notes that apply to every task:
  - Backend errors that a client can see use `ConvexError` with a translatable
    `{ key: 'Namespace.KEY' }` payload (see `src/convex/helpers/createDeleteMutation.ts`
    for the canonical shape). Plain `throw new Error` is only for internal invariants.
  - Every new user-facing string gets a key in BOTH `messages/en.json` and
    `messages/sr.json` (Serbian must be a real translation, not a copy of English).
  - Counters in `analytics.counters` are transactional: every insert/delete/status-flip of
    a counted row must bump the matching key **in the same mutation** (see
    `src/convex/helpers/counterKeys.ts` header comment). This invariant is the root cause
    of tasks A2–A5.

---

## Section A — LAUNCH BLOCKERS

### ⏸️ A1. [DEFERRED BY OWNER] Replace the Resend sandbox sender (signup is currently broken for real users)

**Why:** `src/shared/constants.ts:4` sets `RESEND_EMAIL: 'onboarding@resend.dev'`. That
sandbox address only delivers to the Resend account owner's own inbox. Because
`emailAndPassword.requireEmailVerification: true` in `src/convex/auth/auth.ts`, a real user
signs up, never receives the OTP, and can never finish registration. This is a total
signup outage, not a cosmetic issue.

**Fix:**

1. OPS (human, do first): verify the sending domain in the Resend dashboard
   (add the DKIM/SPF DNS records for `kurosava.com`).
2. Code: change `RESEND_EMAIL` in `src/shared/constants.ts` to the verified sender,
   e.g. `'no-reply@kurosava.com'`. Grep for every usage of `RESEND_EMAIL` /
   `COMPANY_DATA.RESEND_EMAIL` (at minimum `src/convex/auth/helpers/sendVerificationOTP.ts`
   and the reservation/contact email senders) and confirm they all read from the constant —
   they should; do not duplicate the literal anywhere.

**Verify:** trigger a signup with a personal address on a non-owner domain (e.g. a
throwaway Gmail) against the dev deployment and confirm the OTP email arrives.

---

### ✅ A2. [DONE 2026-07-09] `deleteUser` must not orphan owned data

**Why:** In `src/convex/tables/users/userMutations.ts:306-314`, step 3 ("CASCADE") is a
comment with example code — it was never implemented. Deleting a user today removes only
the Better-Auth record. Every `accommodations`, `hospitalities`, `partnerships`,
`reservations`, `guests`, `proTrials`, and `uploadedFilesR2` row referencing that user
survives, pointing at a dead owner: guests keep scanning QR codes of ownerless venues,
dashboard counters stay inflated forever, R2 objects leak, and admin lists render rows
whose owner lookup returns null.

**Fix — block, don't cascade.** Do NOT reimplement cascading here. The venue delete
mutations (`deleteAccommodations`, `deleteMyAccommodation`, `deleteHospitalities`,
`deleteMyHospitality`) already do storage cleanup, counter decrements, audit, and
child-row guards correctly. Re-doing all of that inside `deleteUser` would duplicate that
logic and drift. Instead, refuse to delete a user who still owns rows, forcing the admin
through the already-correct delete paths first:

Replace the step-3 comment block in `userMutations.ts` with:

```ts
// 3. Referential-integrity guard: Convex has no FKs, so deleting a user who
//    still owns rows would orphan them (and permanently drift the counters).
//    Owned data must be deleted through its own mutations first — they carry
//    the storage cleanup, counter decrements, and child guards.
const [ownsAccommodation, ownsHospitality, ownsFile] = await Promise.all([
	ctx.db
		.query('accommodations')
		.withIndex('by_owner', (q) => q.eq('ownerId', args.userId))
		.first(),
	ctx.db
		.query('hospitalities')
		.withIndex('by_owner', (q) => q.eq('ownerId', args.userId))
		.first(),
	ctx.db
		.query('uploadedFilesR2')
		.withIndex('by_owner', (q) => q.eq('ownerId', args.userId))
		.first()
]);
if (ownsAccommodation || ownsHospitality || ownsFile) {
	ctx.audit(AUDIT_ACTIONS.USER_DELETE, {
		resource: { table: 'user', id: args.userId },
		status: 'failure',
		errorMessage: 'USER_HAS_OWNED_DATA'
	});
	return { success: false, message: { key: 'GenericMessages.USER_HAS_OWNED_DATA' } };
}

// 3b. Cascade the harmless per-user rows that have no self-service delete UI.
const proTrials = await ctx.db
	.query('proTrials')
	.withIndex('by_user', (q) => q.eq('userId', args.userId))
	.collect();
for (const row of proTrials) await ctx.db.delete(row._id);
```

Notes:

- Partnerships/reservations/guests all hang off accommodations/hospitalities, so blocking
  on the two venue tables (plus `uploadedFilesR2`) transitively protects them — **provided
  task A4 is also done** (venue deletes must cascade their own children).
- Add `USER_HAS_OWNED_DATA` to `GenericMessages` in `messages/en.json` (e.g. "This user
  still owns accommodations, hospitalities, or files. Delete those first.") and a real
  Serbian translation in `messages/sr.json`. The admin UI already routes
  `{ success:false, message }` envelopes through `translateFromBackend` into a toast —
  no frontend change needed.

**Verify:** in dev, create a user with one accommodation, attempt admin delete → expect
the failure toast; delete the accommodation, retry → user deletes, and confirm no
`proTrials` rows remain for that id.

---

### ✅ A3. [PARTS 1–2 DONE 2026-07-09 · PART 3 DEFERRED (migration)] `deletePartnerships` (admin bulk delete) drifts per-owner counters — unrepairably

**Why:** `src/convex/tables/partnerships/mutations/deletePartnerships.ts` only sets
`totalCounterKey: PARTNERSHIPS_TOTAL`. Compare `revokePartnership.ts:49-63`: on removing an
**active** partnership it also calls `bumpActivePartnershipsForOwners(ctx, accOwner,
hospOwner, -1)` and, for `createType === 'custom'`, decrements
`customPartnershipsCounterKey(accOwner)`. The admin bulk delete does neither, so deleting
an active partnership leaves every affected owner's dashboard "Partnerships" number
(read via `activePartnershipsCounterKey` in `getUserDashboardStats.ts`) permanently high.
Worse: `backfillCountersInternal.ts` does not recompute `customPartnershipsCounterKey`,
so that drift can never be repaired by the existing repair tool.

**Fix (three parts, all in the same PR):**

1. Add an `onDelete` hook to the `createDeleteMutation` config in `deletePartnerships.ts`,
   mirroring the `revokePartnership` decrement logic. Partnerships carry denormalized
   `accommodationOwnerId` / `hospitalityOwnerId` (see `schema.ts` indexes
   `by_accommodation_owner_active_type`) — use them and fall back to `ctx.db.get` only if
   a row predates the backfill:

```ts
onDelete: async (ctx, partnership) => {
	if (!partnership.isActive) return; // inactive rows never incremented the active counters
	const accOwner =
		partnership.accommodationOwnerId ??
		(await ctx.db.get(partnership.accommodationId))?.ownerId;
	const hospOwner =
		partnership.hospitalityOwnerId ??
		(await ctx.db.get(partnership.hospitalityId))?.ownerId;
	if (accOwner && hospOwner) {
		await bumpActivePartnershipsForOwners(ctx, accOwner, hospOwner, -1);
	}
	if (partnership.createType === 'custom' && accOwner) {
		await analytics.counters.bump(ctx, customPartnershipsCounterKey(accOwner), -1);
	}
},
```

2. **Change `phase2Strategy: 'optimized'` to `'sequential'` in this file.** This is not
   optional. The factory's own doc comment (`createDeleteMutation.ts`, DeletePhase2Strategy)
   warns that `'optimized'` runs `onDelete` for all rows in `Promise.all`, and two
   partnerships belonging to the same owner would both read-modify-write the same counter
   key — parallel execution loses updates ("subtract 1 total instead of N"). Sequential is
   correct and still sub-second at the 200-row batch cap.

3. Extend `src/convex/migrations/backfillCountersInternal.ts` to recompute
   `activePartnershipsCounterKey(ownerId)` for every owner (count of active partnerships
   touching them, via the `by_accommodation_owner_active_type` and
   `by_hospitality_owner_active_type` indexes) and `customPartnershipsCounterKey(ownerId)`
   (active AND `createType === 'custom'`, keyed by accommodation owner). Check first —
   if activePartnerships is already covered, only add the custom one. This makes the
   drift that already happened in dev repairable, and gives prod a one-command repair tool.

**Verify:** in dev, create an active partnership between two owners, note both owners'
dashboard partnership counts, admin-bulk-delete the partnership, confirm both counts
dropped by 1. Then run
`bunx convex run migrations/backfillCountersInternal:backfillCounters` and confirm
counts are unchanged (backfill agrees with live counters).

---

### ✅ A4. [DONE 2026-07-09] Venue deletes must cascade inactive children (orphan partnerships / terminal reservations / expired guests)

**Why:** The venue delete mutations _block_ on **active** partnerships
(`hasActiveAccommodationPartnership`, index `by_accommodation_active`) and **open**
reservations (pending/confirmed), but rows that are trial-deactivated, revoked-soft,
cancelled, or no_show are neither blocked nor deleted. After a venue delete those rows
dangle on a nonexistent parent: `PARTNERSHIPS_TOTAL` still counts them, reservation
status counters still count them (there is no reservation delete path at all), and admin
lists surface rows whose `ctx.db.get(accommodationId)` is null. Also fix the stale doc
comment at `src/convex/tables/partnerships/queries/fetchActivePartnershipsSafe.ts:58`
which wrongly claims deletes "cascade" — after this task, it will actually be true.

**Fix:** Create two shared cascade helpers and call them from the `onDelete` hook of all
four venue delete mutations. Do NOT inline four copies.

New file `src/convex/tables/accommodations/helpers/cascadeAccommodationChildren.ts`:

```ts
/** Deletes rows that hang off an accommodation. Callers must have already
 *  verified there are no ACTIVE partnerships or ACTIVE guests (the delete
 *  mutations' authorize guards do this) — everything left is safe to remove. */
export async function cascadeAccommodationChildren(
	ctx: MutationCtx,
	accommodationId: Id<'accommodations'>
) {
	const partnerships = await ctx.db
		.query('partnerships')
		.withIndex('by_accommodation', (q) => q.eq('accommodationId', accommodationId))
		.collect();
	for (const p of partnerships) {
		// Defensive: guard promised no active rows, but if one slips through,
		// keep the owner counters honest exactly like revokePartnership does.
		if (p.isActive) {
			/* same decrement block as A3's onDelete */
		}
		await ctx.db.delete(p._id);
	}
	if (partnerships.length > 0) {
		await analytics.counters.bump(ctx, COUNTER_KEYS.PARTNERSHIPS_TOTAL, -partnerships.length);
	}

	const guests = await ctx.db
		.query('guests')
		.withIndex('by_accommodation_expires', (q) => q.eq('accommodationId', accommodationId))
		.collect();
	for (const g of guests) await ctx.db.delete(g._id);
	if (guests.length > 0) {
		await analytics.counters.bump(ctx, COUNTER_KEYS.GUESTS_TOTAL, -guests.length);
	}
}
```

New file `src/convex/tables/hospitalities/helpers/cascadeHospitalityChildren.ts` — same
shape: partnerships via the `by_hospitality` index (+ `PARTNERSHIPS_TOTAL` decrement, same
defensive active handling), then reservations. Reservations must decrement TWO counters
per row (see `counterKeys.ts`): `reservationStatusCounterKey(r.status)` and
`ownerReservationStatusCounterKey(r.hospitalityOwnerId, r.status)`. Query them with the
`by_hospitality_status` index once per status in `RESERVATION_STATUSES`, or a single
`by_hospitality`-prefixed scan if such an index exists — check `schema.ts` and use the
narrowest existing index; add an index only if none fits. Batch the counter bumps per
status (one bump of `-count`, not `-1` per row).

Wire-up in all four delete mutations (`deleteAccommodations.ts`, `deleteMyAccommodation.ts`,
`deleteHospitalities.ts`, `deleteMyHospitality.ts`):

- add `onDelete: (ctx, doc) => cascadeAccommodationChildren(ctx, doc._id)` (respectively
  the hospitality helper). If a mutation already has an `onDelete`, call the cascade from
  inside it.
- **ensure `phase2Strategy` is `'sequential'`** (or simply omitted — sequential is the
  default) on all four, for the same shared-counter reason as A3.

**Verify:** dev flow — create accommodation + hospitality + partnership, revoke the
partnership (row becomes… actually revoke hard-deletes; instead expire a trial or
soft-deactivate to produce an inactive row), create a reservation and cancel it, then
delete the hospitality. Confirm: the inactive partnership row and cancelled reservation
row are gone, `PARTNERSHIPS_TOTAL` and `reservations.cancelled` counters dropped
accordingly, and `backfillCounters` reports no correction needed.

---

### ✅ A5. [DONE 2026-07-09] Scheduled sweep for expired guests (counter drifts upward forever otherwise)

**Why:** Expired guest rows are currently deleted only lazily — when a NEW scan hits the
same accommodation (`createGuest.ts:70-84`). An accommodation that never gets re-scanned
keeps its expired guest rows forever, and `GUESTS_TOTAL` (admin dashboard) counts them
indefinitely. A4 handles the venue-delete case; this handles the steady state.

**Fix:**

1. Add a global expiry index to `guests` in `src/convex/schema.ts`:
   `.index('by_expires', ['expiresAt'])` (the existing `by_accommodation_expires` cannot
   serve a global sweep).
2. New cron registration mirroring the existing pattern in
   `src/convex/tables/proTrials/registerProTrialCrons.ts` /
   `src/convex/storage/registerStorageCrons.ts`: a daily `internalMutation` that queries
   `by_expires` for `expiresAt < Date.now()`, `.take(200)` per run-loop iteration, deletes
   the rows, and bumps `COUNTER_KEYS.GUESTS_TOTAL` by `-deletedCount` once per batch.
   If more than 200 remain, reschedule itself via `ctx.scheduler.runAfter(0, …)` (look at
   how the existing crons/migrations page through big tables and copy that pattern).
3. Keep the lazy cleanup in `createGuest` — it gives immediate per-accommodation
   consistency at zero extra cost; the cron only catches what it misses.

**Verify:** in dev, insert a guest with a past `expiresAt`, run the internal mutation via
`bunx convex run`, confirm the row is gone and `guests.total` decremented.

---

### ⏸️ A6. [DEFERRED BY OWNER] Error monitoring (you currently cannot know production is broken)

**Why:** Production 500s go only to `console.error` (`src/hooks.server.ts:18-23`,
`handleError`). Nobody tails Vercel logs all day. Without alerting, the first report of an
outage will be a user churning.

**Fix:** Add Sentry via `@sentry/sveltekit` (official SvelteKit SDK, wraps both hook
files):

1. `bun add @sentry/sveltekit`.
2. `src/hooks.client.ts`: `Sentry.init({ dsn: PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 })`
   and export `handleError = Sentry.handleErrorWithSentry(existingHandler)`.
3. `src/hooks.server.ts`: same init (server DSN can be the same), wrap the existing
   `handleError` with `Sentry.handleErrorWithSentry(...)` — KEEP the existing behavior
   (404 filtering, returning only `{ message }` to the client). Add `Sentry.sentryHandle()`
   at the FRONT of the existing `sequence(...)` of handles.
4. Add `PUBLIC_SENTRY_DSN` to `.env.example` and the Vercel env (ops).
5. Do not add session replay or heavy integrations — error capture + traces at 10% is
   enough at launch.

**Verify:** throw a test error in a dev route, confirm it appears in the Sentry project.

---

### ✅ A7. [DONE 2026-07-09] Protected layout must reject invalid sessions, not just missing ones

**Why:** `src/routes/(protected)/+layout.server.ts:13-15` only checks `if (!locals.token)`.
`locals.token` is set straight from the cookie in `hooks.server.ts` without validation, so
an EXPIRED session passes the guard, `getCurrentUser` then resolves null, and the user
lands on a broken empty-state dashboard instead of the login page. The admin layout
already does this correctly.

**Fix:** Mirror `src/routes/(protected)/admin/+layout.server.ts:14-19` exactly: in
`(protected)/+layout.server.ts`, after the token check, `const { currentUser } = await
event.parent();` and `throw redirect(302, UNPROTECTED_PAGE_ENDPOINTS.LOGIN)` when
`currentUser` is null. (The root layout already fetches `currentUser`; `event.parent()`
reuses it — zero extra queries.) Keep the cheap `!locals.token` fast-path first.

**Verify:** log in, delete/corrupt the session cookie's backing session (revoke it via the
sessions UI from another browser), reload a protected page → must redirect to `/login`.

---

### ✅ A8. [DONE 2026-07-09] Rate-limit the three unmetered public endpoints

**Why:** Everything else in the app goes through the central registry
(`src/convex/rateLimits/registry.ts`); these three slipped through and are reachable with
nothing but a guest cookie (or, for the token route, nothing at all — its own TODO at
`src/routes/api/guest-auth/token/+server.ts:31` admits it). A hostile guest on venue WiFi
can spam multi-read+write mutations for free.

**Fix (follow the existing pattern exactly — registry entry + `enforceRateLimit` at the
top of the handler):**

1. `viewHospitality` (`src/convex/tables/hospitalities/mutations/viewHospitality.ts`):
   add `viewHospitality: limitPresets.interactiveWrite` to `convexRateLimitRegistry`,
   then after the guest session resolves (you need `guest._id` for the key), add
   `await enforceRateLimit(ctx, 'viewHospitality', rateLimitKey.guest(guest._id));`
   exactly like `createReservation.ts:94`. The pre-guest early-exits are cheap reads and
   fine unmetered.
2. `createGuestSharingCode` (`src/convex/tables/guests/mutations/createGuestSharingCode.ts`):
   registry entry with `limitPresets.interactiveWrite` (or `connectCodeLookup` — pick the
   tighter one; sharing-code generation is rare) + `enforceRateLimit(ctx,
'createGuestSharingCode', rateLimitKey.guest(guest._id))`.
3. Guest token endpoint (`src/routes/api/guest-auth/token/+server.ts`):
   - Wrap the `client.action(...)` call in try/catch; on failure return the same
     structured unauthorized/JSON-error response the client (`guestAuth.svelte.ts`)
     already tolerates — a transient Convex blip must not become an unhandled 500.
   - Rate-limit it IP-keyed, mirroring how `createGuest` does it: the SvelteKit route
     already resolves the client address (see how the guest activate flow passes `ip` into
     the Convex function and charges `rateLimitKey.ip(args.ip)` at
     `createGuest.ts:44`). Add a registry entry (e.g. `guestTokenMint:
limitPresets.guestStayActivate`), pass the IP into the Convex action, and enforce
     inside the action. Do NOT build a SvelteKit-side in-memory limiter — it resets per
     serverless instance and gives false safety.

**Verify:** hammer each endpoint >capacity times in a minute from dev and confirm the
rate-limit error shape comes back (client already maps it via `isRateLimitError` /
`rateLimitMessages.ts`).

---

### ✅ A9. [DONE 2026-07-09 — one manual browser check pending] Destructive-action dialogs give zero pending feedback (invites double-fires)

**Why:** In `src/shared/components/ui/alert-dialog-button/alert-dialog-button.svelte`
(`handleAction`, ~line 68), the bits-ui `AlertDialogPrimitive.Action` auto-closes the
dialog on click, so for async mutations the dialog is gone before the `await` finishes:
the `{#if isPending}` spinner and `disabled={isPending}` bindings never render anywhere.
On a slow delete/confirm the user sees nothing happen and clicks again.

**Fix:**

1. In the Action's click handler: `event.preventDefault()` FIRST (stops bits-ui's
   auto-close), then `if (isPending) return;`, then set pending, `await` the action in a
   try/finally, and only set `open = false` in the finally. The existing `isPending`
   spinner/disabled markup now actually renders inside the still-open dialog.
2. While in there: `src/shared/components/ui/mutation-form/mutation-form.svelte`
   `handleSubmit` (~line 118) — add `if (busy) return;` as the first statement, matching
   the guard the auth form models already have (`login-form-model.svelte.ts:35`).

**Verify:** throttle the network in devtools, trigger a delete → dialog stays open with
spinner and disabled buttons until the toast fires; double-Enter on a mutation form fires
exactly one mutation.

---

### ⏸️ A10. [DEFERRED BY OWNER] Contact form: i18n + error handling (the one feature that bypassed the conventions)

**Why:** Serbian-market app, but the contact form alone shows English no matter the
locale: `src/features/contact/schemas/contactSchemas.ts:7-14` hardcodes English validation
strings (every other schema uses `m['ValidationMessages…']()` — see
`reservationsSchemas.ts:14`), `contact-submit-button.svelte:64` hardcodes the literal
`Send message` label, and on failure `contactActions.remote.ts:30` returns the raw Resend
SDK error string which gets toasted verbatim to the user. Additionally
`contactSection.svelte.ts:26` exports a module-level singleton class — form state is
global, so inputs persist stale across navigations.

**Fix (minimal, don't over-refactor):**

1. Swap the hardcoded schema messages for paraglide message calls, adding the keys to
   `en.json` + `sr.json` (mirror the naming style of the existing
   `ValidationMessages` namespace).
2. Replace the `Send message` literal with a message key.
3. In `contactActions.remote.ts`, on failure return a translatable key (add e.g.
   `ContactSection.SEND_FAILED` = "Something went wrong sending your message. Please try
   again.") instead of `error.message`; keep the raw error in a server-side
   `console.error` for Sentry to pick up (A6).
4. Replace the module-level `export const contactSectionClass = new …()` with
   instantiation inside the contact-section component (plain `const form = new
ContactSectionClass()` in the component script) so each mount gets fresh state.

**Verify:** switch locale to sr, submit invalid contact form → Serbian validation
messages; kill the network → localized failure toast, no raw SDK text.

---

### ✅ A11. [DONE 2026-07-09] Fill the 13 missing Serbian message keys

**Why:** `messages/sr.json` is 13 leaf keys short of `en.json`; those UI spots silently
fall back to English for Serbian users.

**Fix:** Add real Serbian translations (not English copies) for exactly these keys:

- `SearchDialog.done`, `SearchDialog.hint`, `SearchDialog.loading`,
  `SearchDialog.noResults`, `SearchDialog.selectedCount`
- `RequestReservationDialog.quickTimesLabel`
- `SelectAccommodationDialog.searchPlaceholder`, `SelectHospitalityDialog.searchPlaceholder`
- `StayPage.StayAccommodationData.addressLabel`, `.perksBody`, `.perksEyebrow`, `.perksTitle`
- `StayPage.StayLocationSection.openMapMobile`

`scripts/generate-sr-messages.ts` is merge-safe and can scaffold the stubs; the actual
Serbian text must be written by a human-quality translation (the app's existing sr.json
tone is informal-professional — match it).

**Verify:** re-run a leaf-key diff of the two files → 0 missing, 0 extra.

---

### ✅ A12. [DONE 2026-07-09] Mechanical hygiene: formatter + the 2 eslint errors

**Why:** `bun run lint` currently exits 1 (68 files unformatted, so eslint gates deploys
red), and eslint itself has 2 real errors.

**Fix:**

1. `bun run format` (fixes the 68 prettier files).
2. Delete the unused import `partnershipAccommodationSafeValidator` at
   `src/convex/tables/partnerships/helpers/getCustomPartnershipsForStaySafe.ts:6`.
3. Remove the unused `_props` binding at
   `src/shared/components/pages/(protected)/partnerships/partnerships-tabs/partnerships-platform-table.svelte:89`.

**Verify:** `bun run lint` exits 0.

---

### ✅ A13. [DONE 2026-07-09] Pin the Vercel adapter

**Why:** `svelte.config.js:14` uses `@sveltejs/adapter-auto`, which resolves the platform
at build time and exposes zero configuration. The build log literally prints "Could not
detect a supported production environment" locally. Pinning `adapter-vercel` gives
deterministic builds and access to runtime/region/function config if ever needed.

**Fix:** `bun add -d @sveltejs/adapter-vercel`, swap the import in `svelte.config.js`
(`import adapter from '@sveltejs/adapter-vercel';` — the `adapter()` call stays as-is),
remove `@sveltejs/adapter-auto` from devDependencies.

**Verify:** `bun run build` succeeds and the adapter log line says vercel.

---

### ✅ A14. [DONE 2026-07-09] robots.txt: stop inviting crawlers into the app shell

**Why:** `static/robots.txt` currently allows everything. `/admin`, `/dashboard`, and the
other protected routes should not be crawled (they 302 to login anyway, but crawl budget
and URL disclosure are both worth the two lines).

**Fix:** Add `Disallow:` lines for the protected route roots (`/admin`, `/dashboard`,
`/my-accommodations`, `/my-hospitalities`, `/partnerships`, `/reservations`, `/settings` —
check `src/shared/page-endpoints.ts` for the authoritative list) while keeping `/` allowed
for the public marketing/stay pages.

**Verify:** file review; nothing else consumes robots.txt.

---

### ✅ A15. [DONE 2026-07-09] Fix the stale/lying docs the reviews found

**Why:** Stale docs cause wrong decisions later — two were found actively misdescribing
the code.

**Fix:**

1. `README.md:137` — the production checklist still says CSP allows
   `unsafe-inline`/`unsafe-eval`; the config (`svelte.config.js:30-76`) was already
   tightened to hash-based CSP. Update the checklist item to reflect reality.
2. `src/convex/tables/partnerships/queries/fetchActivePartnershipsSafe.ts:58` — comment
   claims delete mutations cascade into partnerships; after A4 they actually do, so
   reword the comment to describe the block-on-active + cascade-inactive behavior.
3. Add the Section B runbook below to `README.md`'s production checklist (or link to this
   file from there) so the deploy procedure lives somewhere a human will look.

---

## Section B — DEPLOY RUNBOOK (human/ops, execute in this order)

Environment prep (Convex prod deployment + Vercel project env):

1. Set ALL env vars from `.env.example` in their production variants. Specifically:
   - `SEARCH_INPUT_RATE_LIMIT_SECRET` — a strong random value
     (`openssl rand -base64 32`), NOT the dev placeholder. It gates the trusted-server
     guest mutations; a guessable value lets attackers bypass guest rate limiting.
   - `BETTER_AUTH_SECRET`, R2 keys, `RESEND_API_KEY`, `GOOGLE_CLIENT_SECRET` — production
     values. Rotate the dev credentials currently in `.env.local` (they've lived on a dev
     machine; treat them as burned for prod purposes).
   - `PUBLIC_SENTRY_DSN` (from A6).
2. Restrict `PUBLIC_GOOGLE_MAPS_API_KEY` by HTTP referrer (your prod domain) in Google
   Cloud Console — it ships to every browser; referrer restriction is the only thing
   preventing quota theft.
3. Resend: domain verified (A1), prod `RESEND_API_KEY` in the Convex env.

Deploy sequence (order matters — each constraint is documented in the migration file
headers, consolidated here):

1. **BEFORE the schema push**: run
   `bunx convex run migrations/dropAccommodationDescriptionInternal:dropAccommodationDescription --prod`
   (schema validation rejects the push while old `description` fields exist).
2. Deploy Convex (`bunx convex deploy`) and the SvelteKit app (Vercel).
3. **Immediately after deploy, in this order**:
   ```
   bunx convex run migrations/backfillPartnershipOwnerIdsInternal:backfillPartnershipOwnerIds --prod
   bunx convex run migrations/backfillHospitalityCreateTypeInternal:backfillHospitalityCreateType --prod
   bunx convex run migrations/backfillPartnershipCreateTypeInternal:backfillPartnershipCreateType --prod
   bunx convex run migrations/backfillHospitalityConnectCodeInternal:backfillHospitalityConnectCode --prod
   bunx convex run migrations/backfillCountersInternal:backfillCounters --prod
   ```
   Owner-IDs first (owners see empty partnership lists until it runs), createType
   backfills before counters (the custom-partnership counter added in A3 counts by
   createType), counters last so they count the final row states.
4. Smoke test in prod: sign up with a real external email (proves A1), scan a QR/stay
   flow, create + confirm a reservation, check the admin dashboard totals are non-zero.
5. Confirm the first Sentry event arrives (trigger a deliberate 404→no, use a test error
   route or the Sentry SDK's `captureMessage` from a temporary admin action).

---

## Section C — POST-LAUNCH (do soon; none of these gate the launch)

Ordered by value:

1. **Reservations filter: stop filtering on the denormalized name.**
   `createFetchReservationsQuery.ts` matches `selectedHospitality` against
   `hospitalityName`, which goes stale when a venue renames
   (`updateHospitality` never rewrites old reservations) AND forces the filtered path to
   `.collect()` every reservation for the owner and filter in memory per keystroke
   (line ~122). Fix both at once: have the client send `hospitalityId` and query the
   existing `by_hospitality_status` index instead. Keep `hospitalityName` on the row as a
   display-only snapshot (point-in-time name is acceptable for display; it must just never
   be a filter key). Free-text guest-name search, if needed later, should be a Convex
   `searchIndex`, not an in-memory filter.
2. **Per-email/per-IP auth rate limits** (README:141 TODO). Current auth buckets are
   function-global; a distributed credential-stuffing run shares one bucket with all
   legitimate users. Add keyed buckets (key = normalized email for sign-in/OTP, IP for
   sign-up) via the same registry mechanism used in `auth/authRoutes.ts` hooks.
3. **`cleanupOrphanDataR2` scalability + abandoned-upload GC**
   (`storage/crons/cleanupOrphanDataR2.ts:39`): it `.collect()`s the whole
   `uploadedFilesR2` table each run, and an upload that inserted a row but was never
   attached to a venue is "consistent" by its bidirectional check, so it is NEVER
   reclaimed. Switch to cursor pagination (`.paginate` loop across scheduled runs) and add
   a rule: rows older than 24h whose key is not referenced by any
   accommodation/hospitality get deleted (row + object).
4. **Env validation at boot.** Missing env vars currently fail scattered:
   `auth.ts:82-83` non-null-asserts Google creds (opaque OAuth failure),
   `auth.config.ts:20-23` silently disables the guest provider when `SITE_URL` is unset.
   Add one module (e.g. `src/convex/helpers/env.ts` and a mirror for SvelteKit server env)
   that reads and asserts every required var with a clear error naming the variable, and
   import values only from there.
5. **`countUsers` full scan** (`auth/component/userQueries.ts:106`): `.collect()`s the
   whole user table to count. Fine at hundreds of users; convert to an
   `analytics.counters` key (bump on user create/delete, backfill entry) like every other
   dashboard total when user count grows.
6. **Portfolio summary N+1** (`fetchMyAccommodationsSummary.ts:33`,
   `fetchMyHospitalitiesSummary.ts:33`): per-entity active-partnership collects, re-run
   reactively on any partnership write. Bounded per owner; optimize only if owner
   portfolios grow large (a per-owner counter or a single indexed pass both work).
7. **`dashboard-stats.svelte:49` query gating**: runs `() => ({})` unconditionally while
   sibling pages skip until auth settles (`authClass.userLoading` pattern). Align it.
8. **Combobox accessibility**
   (`google-places-autocomplete.svelte`): add `id`s to the option `<li>`s and
   `aria-activedescendant` on the input tracking `activeIndex`, so screen readers announce
   keyboard-highlighted options.
9. **SEO**: add a `sitemap.xml` route for the public pages, default
   `<meta name="description">`/OG tags in `app.html` as a fallback (per-page
   `<svelte:head>` already covers key pages; `COMPANY_DATA` in `src/shared/constants.ts`
   already has OG image/description ready to use).
10. **Guest-token endpoint hardening follow-up**: after A8, consider signing the token
    response with short TTLs if guest abuse is observed (current design is fine for
    launch).
11. ~~**Reservations from deleted guests**~~ — DONE 2026-07-09 (owner requested): guest
    deletion now system-cancels PENDING reservations
    (`cancelPendingReservationsForGuest.ts`, all three deletion sites), transferring
    both the global and per-owner pending→cancelled counters and emitting
    `reservation.cancelled` with `reason: 'guest_expired'`. Terminal rows untouched.

---

## Section D — CONSISTENCY STANDARDIZATIONS (code quality; batch these opportunistically)

These make the codebase cheaper to maintain. None affect users. Safe for a smaller model
to execute mechanically; each is verifiable by `bun run check && bun run lint`.

1. **`src/convex/tables/users/` layout**: it is the only table with flat
   `userMutations.ts`/`userQueries.ts` files; all 7 other tables use `mutations/` +
   `queries/` folders with one function per file. Split it to match. Update imports
   (grep `tables/users/userMutations` / `userQueries`).
2. **Backend error convention**: `ConvexError` (typed, translatable payload) for anything
   a client can receive; plain `Error` only for internal invariants (crypto, config,
   internal jobs). Audit the 12 files using `throw new Error` inside `src/convex` against
   that rule; also unify query auth behavior — pick ONE of "throw
   `ConvexError('NOT_AUTHENTICATED')`" vs "return null" for unauthenticated queries
   (recommendation: return null for queries — the UI treats it as logged-out state —
   and throw only in mutations).
3. **Imports**: 300 climbing `../` imports vs 2,464 `@/` alias imports. Add an eslint
   `no-restricted-imports` rule banning `../` patterns, then mechanically rewrite
   offenders to `@/`. Keep `./` for same-folder siblings.
4. **Ownership checks**: three coexisting styles (owner-or-admin helper like
   `getAccommodationForEdit`, owner-only helper like `getOwnedAccommodation`, and inline
   `doc.ownerId !== ctx.userId` at e.g. `createCustomPartnership.ts:52`,
   `confirmReservation.ts:24`). Standardize on the helper forms; replace inline checks.
   Also: two admin checks exist with different no-session behavior — `isAdminUser`
   (returns false) vs `requireAdmin` (throws). Document in each file header when to use
   which, or better: keep `requireAdmin` for gating and rename `isAdminUser` usages that
   actually mean "gate" to `requireAdmin`.
5. **Convex entrypoint naming**: `fetch*` for public queries/mutations (40 already
   comply); rename the strays (`getCurrentUser`, `getUserById` in userQueries,
   `getAccommodationByIdSafe`) and keep `get*` for internal helpers only. NOTE: renaming
   Convex exports changes the client-side `api.` paths — do it in one sweep with a global
   grep, and regenerate `_generated`.
6. **Feature folder template**: `src/features/*` — no two share a layout (`forms` vs
   `components`, `data` vs `schemas`, ad-hoc `classes`/`client`/`lib`). Canonical
   template: `components/`, `schemas/`, `utils/`, `types/`, optional `i18n/`. Fold
   `forms`→`components`, `data`→`schemas`, `classes`/`client`/`lib`→`utils`.
7. **File naming**: camelCase for non-component `.ts` (271 already comply); rename the 16
   kebab-case strays, EXCEPT files that mirror an adjacent kebab `.svelte` component
   (`normal-header.svelte.ts` style is fine — document that carve-out). Worst offender to
   fix: `src/shared/utils/` mixes both styles in one folder.
8. **Merge `src/utils/` into `src/shared/utils/`** (2 files: `distance.ts`,
   `loadingTimeout.svelte.ts`) and delete the top-level dir.
9. **`type` over `interface`**: convert the 10 files using `interface` (13 occurrences)
   to `type`, except `src/app.d.ts` where declaration merging requires `interface`.
10. ~~**Repo root cleanup**~~ — DONE 2026-07-09: `CustomPartnershipPlan.md`,
    `fetchOptimizedTODO.md`, and `LANDING_PAGE.md` were completed-planning docs with no
    code references and have been deleted (their features shipped). `DESIGN.html` and
    `ABOUT_COMPANY.md`/`ABOUT_COMPANY_RS.md` were kept in place, not moved — they're live
    reference docs, actively cited (`AGENTS.md` requires reading `DESIGN.html` before any
    UI work; `schema.ts:24` points to `ABOUT_COMPANY.md`), so relocating them would break
    those references for no benefit. Remaining: convert
    `scripts/optimize-images.mjs` to `.ts` to match the other four scripts, or leave a
    one-line comment in it explaining why it's `.mjs`.
11. **Lint rules to lock the conventions in** (add to `eslint.config.js`):
    `@typescript-eslint/prefer-nullish-coalescing` (204 `||` fallbacks — some are latent
    bugs on `0`/`''`), `no-restricted-imports` (item 3), and optionally
    `simple-import-sort`. Fix resulting errors mechanically. Run the full verify suite
    after: `bun run check && bun run lint && bun run build`.
12. **Duplication (leave until it hurts)**: the accommodation/hospitality mirror pairs
    (`my-accommodations` vs `my-hospitalities` pages, delete dialogs, edit forms, the
    duplicated `addressField` snippet in `add-hospitality-form.svelte:73-98` vs
    `edit-hospitality-form.svelte:276-301`) are shallow copies over already-shared
    abstractions. Deduplicate the `addressField` snippet and the delete dialogs (a
    two-prop generic component each); do NOT attempt a grand generic `<EntityList>`
    abstraction — the duplication is cheaper than the wrong abstraction.

---

## Final gate (run after Section A is complete, before Section B deploy)

```
bun run format
bun run lint        # must exit 0
bun run check       # must report 0 errors
bun run build       # must succeed
```

Plus the per-task Verify steps above. When those pass and the Section B runbook has been
executed against production: **launch**.
