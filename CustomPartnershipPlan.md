# Custom Partnership — Implementation Plan

Planning document only. No code in this pass — this is the blueprint the next
session (me or another agent) implements against.

---

## 0. Ground truth already in production

Before proposing anything, two facts constrain this design:

1. **Partnership creation is currently admin-only.** `createPartnership`
   (`src/convex/tables/partnerships/mutations/createPartnership.ts`) is an
   `adminMutation`. There is no self-service partnership flow for regular
   users today — this feature introduces one for the first time. Same for
   hospitalities: `createHospitality` is `adminMutation`; only
   `createMyAccommodation` has a self-service precedent
   (`authMutation`, owner-scoped). That's the pattern this feature follows.

2. **The landing page has already made a public promise** —
   `src/shared/components/pages/(unprotected)/root/pricing-section/pricing-section-accommodations.svelte`:
   > "Your first custom partnership, included" (free forever tier)
   > "Want more custom partnerships? ... a simple seasonal **Pro** plan
   > covers it — only if and when you need it."

   This fixes the plan naming: **Pro** (not "Premium"/"Plus"/tiered), and
   it's framed as **seasonal** (time-boxed), not a flat per-item purchase.

---

## 1. Decisions (resolved)

1. **Visibility of user-created hospitalities is admin-only, self-serve for
   no one.** There is no owner-facing "publish" toggle. A user-created
   hospitality defaults to `visibility: "private"` and stays that way unless
   you (the platform owner) flip it — matching Card B's promise to the
   letter, since the owner never gets a lever to change it themselves. In
   practice this means the "connect to another user's hospitality" pool
   starts **empty** and grows only as you manually curate it from the admin
   side. That's fine — it's a feature, not a gap: you get to vet what
   becomes cross-connectable before it is.
2. **Ownership determines instant vs. request.** This is the one decision
   that reshapes the build (see §2 and §4.2):
   - Accommodation owner connects to **their own** hospitality (same
     `ownerId` on both sides) → **instant**, exactly like the original plan.
   - Accommodation owner connects to **another user's** hospitality → a
     **partnership request** is created instead of a live partnership. The
     hospitality owner must accept it before it becomes real. This applies
     regardless of the target hospitality's `visibility` — if it's public
     because you published it, a different user can still only *request*,
     never instant-connect, since they don't own it.
   - Card B ("create custom hospitality yourself") is **always** same-owner
     at creation time — you just made it, you own it — so it stays instant,
     unchanged from the original plan.
3. **No upgrade CTA for now.** The quota-exceeded state shows a plain,
   non-interactive notice. No link, no mailto, no contact-form redirect —
   there is genuinely nothing to send them to yet, and inventing a
   destination would be worse than admitting there isn't one.
4. **`plan` is admin-toggled by hand.** No self-serve upgrade flow, no
   expiry enforcement in phase 1. `planExpiresAt` stays in the schema as an
   optional field for later, but nothing reads or enforces it yet — it's
   inert until you decide to wire real billing.

---

## 2. Data model changes

### `hospitalities` table (`src/convex/schema.ts`)

Add two fields:

```
createType: v.union(v.literal('platform'), v.literal('user'))
visibility: v.union(v.literal('private'), v.literal('public'))
```

- `createType` — who made the row. `"platform"` = created via the existing
  admin `createHospitality` mutation. `"user"` = created via the new
  self-service flow (§5.2).
- `visibility` — whether it's browsable by *other* users in the connect
  flow. Set **exclusively by admins** (§5.6) — never by the owning user, per
  decision #1. `"platform"` hospitalities are always effectively public
  (the existing admin partnership picker already treats them this way).
  `"user"` hospitalities are born `"private"` and stay that way until an
  admin flips them.
- Existing rows: backfilled to `createType: "platform"`, `visibility:
  "public"` (every hospitality today was admin-created) via
  `backfillHospitalityCreateTypeInternal.ts`, same shape as
  `src/convex/migrations/backfillCountersInternal.ts`.
- New index: `by_visibility` (or a composite `by_visibility_and_type` if the
  connect-flow browse query benefits from filtering by type too) so the
  connect picker never scans the whole table.

### `partnershipRequests` — new table

Card A's cross-owner path can't reuse the `partnerships` table directly —
every existing consumer of `partnerships` (guest-facing hospitality
lookups, analytics scopes, the "active partnerships" counts on both owner
headers, the admin partnership list) assumes a row there is a **live,
working link**. Injecting a "pending" state into that table means auditing
and patching every one of those call sites to filter it out — high risk for
what should be an additive feature. A separate table keeps `partnerships`
exactly as every existing reader already assumes, and only a genuinely new
mutation ever touches the new table.

Shape mirrors `reservations` deliberately — same "denormalize the owner id
for cheap owner-scoped queries, use a status union, index the pair" pattern
this codebase already uses:

```
partnershipRequests: defineTable({
  accommodationId: v.id('accommodations'),
  accommodationOwnerId: v.string(),   // denormalized — "my sent requests" query
  accommodationScanToken: v.string(), // denormalized, matches partnerships' existing convention
  hospitalityId: v.id('hospitalities'),
  hospitalityOwnerId: v.string(),     // denormalized — "my received requests" query
  status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('declined')),
  benefit: v.optional(v.string()),    // set by the hospitality owner on accept, not by the requester
  respondedAt: v.optional(v.number())
})
  .index('by_accommodation', ['accommodationId'])
  .index('by_hospitality', ['hospitalityId'])
  .index('by_hospitality_owner_status', ['hospitalityOwnerId', 'status'])
  .index('by_accommodation_owner_status', ['accommodationOwnerId', 'status'])
  .index('by_pair', ['accommodationId', 'hospitalityId'])
```

- No `benefit` field is collected from the requester (§4.2 — unchanged
  reasoning: the guest-facing offer is the hospitality owner's call, not the
  connecting accommodation's). The hospitality owner supplies it when they
  accept.
- `by_pair` lets the request mutation reject a duplicate pending request to
  the same hospitality before inserting another one, same defensive check
  `createPartnership` already does against `partnerships.by_pair`.
- On accept, the row's `status` flips to `"accepted"` and a **new** row is
  inserted into `partnerships` in the same transaction — the request table
  is a queue, not the source of truth for active links. On decline, `status`
  flips to `"declined"` and nothing else happens; the requester can see the
  outcome in their "sent" list.

### `hospitalities` — no owner-facing visibility field, confirmed

Per decision #1, `updateHospitality` (owner-scoped mutation) is
**deliberately not touched** — visibility never appears in its args. Adding
it there would silently give owners the toggle you just said "no one" gets.

### `users` (better-auth `additionalFields`, **not** `schema.ts`)

`role` already lives here as a precedent
(`src/convex/auth/auth.ts` → `createAuthOptions().user.additionalFields`):

```
plan: {
  type: 'string',
  required: true,
  defaultValue: 'free',
  input: false   // server-only, same reasoning as `role` — a client must
                  // never be able to set their own plan via signUp/updateUser
}
planExpiresAt: {
  type: 'number',
  required: false,
  input: false    // inert in phase 1 — reserved for when real billing lands
}
```

After editing `createAuthOptions`, regenerate the component schema exactly
like `role` was added:
`npx auth generate --output src/convex/auth/component/schema.ts`, then
`bunx convex codegen`. `plan` then flows through `getCurrentUser` →
`authClass.currentUser` automatically, same as `role` does today.

### Quota counter (reuses the `analytics.counters` module, no new table)

One counter per user: key `customPartnerships.count:{userId}`. **Bumped
only when a partnership actually becomes active** — i.e. on instant connect,
on Card B creation, and on request *acceptance*. Never bumped on request
*send*. This matters: if quota were consumed at request time, a single
declined request would permanently burn a free user's only slot for
something that never happened. Consuming at the moment the row lands in
`partnerships` keeps the counter meaning exactly "active custom
partnerships you have," which is also the simplest thing to explain in the
UI.

---

## 3. Where it lives in navigation

New sidebar item in
`src/routes/(protected)/+layout.svelte` → `navItems.navMain`, positioned
**after "My Hospitalities", before "Reservations"**.

- Label: new i18n key `ProtectedSidebar.customPartnerships`.
- Icon: `HandshakeIcon` from `@lucide/svelte/icons/handshake` (confirmed
  present in the installed package).
- Optional polish, not phase-1-required: a pending-request count badge on
  the nav item itself, using the existing `SidebarMenuBadge` primitive
  (`src/shared/components/ui/sidebar/sidebar-menu-badge.svelte`) — but note
  this primitive isn't wired into `AppSidebarNavItem` today (checked
  `types.ts`; no `badgeCount` field, `app-sidebar.svelte` doesn't render one
  anywhere yet). Adding it is a small, real change — a new optional field on
  `AppSidebarNavItem` plus one render branch — not a drop-in reuse. Fine to
  defer to phase 2.
- New route constants in `PROTECTED_PAGE_ENDPOINTS`
  (`src/shared/constants.ts`):
  ```
  CUSTOM_PARTNERSHIPS: resolve('/custom-partnerships'),
  CUSTOM_PARTNERSHIPS_CONNECT: resolve('/custom-partnerships/connect'),
  CUSTOM_PARTNERSHIPS_CREATE_HOSPITALITY: resolve('/custom-partnerships/create-hospitality'),
  ```
- New route files under `src/routes/(protected)/custom-partnerships/`:
  `+page.svelte`, `connect/+page.svelte`, `create-hospitality/+page.svelte`.

Admin side gets one small addition (§5.6) on the existing
`admin/hospitalities` pages — no new admin route.

---

## 4. Page-by-page design

All pages follow the existing page shell exactly (see
`src/routes/(protected)/my-hospitalities/+page.svelte`): `<section
class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">`, a
header card, then content. Per `DESIGN.html` §06, reuse `Card`, `Button`,
`Badge`, `NotificationBadge`, `Tabs`, `ConvexMutationForm`, the
dialog-picker pattern, `Spinner`/`Skeleton`, `ErrorComponent` — no new
primitives.

### 4.1 Hub page — `/custom-partnerships`

**Header** (new component, `custom-partnerships-header.svelte`, modeled on
`my-hospitalities-header.svelte`):

- Title + description.
- A quota `Badge`, sourced from `analytics.counters.get`:
  - Free, quota remaining: `variant="outline"`, "1 of 1 free partnership
    used" / "0 of 1 used".
  - Free, quota exhausted: `variant="secondary"`, `CrownIcon` accent, "Free
    quota used".
  - Pro: `variant="default"`, `SparklesIcon`, "Pro — unlimited".

**Two big choice cards** — unchanged from the original plan (`sm:grid-cols-2`,
standard-tier `Card`, icon chip + body + one primary `Button` each, styled
like `pricing-section-accommodations.svelte`):

- **Card A — "Connect with an existing hospitality"** → `Button` →
  `appGoto(PROTECTED_PAGE_ENDPOINTS.CUSTOM_PARTNERSHIPS_CONNECT)`.
- **Card B — "Create your own custom hospitality"** → `Button` →
  `appGoto(PROTECTED_PAGE_ENDPOINTS.CUSTOM_PARTNERSHIPS_CREATE_HOSPITALITY)`.

Both stay clickable regardless of quota state (unchanged reasoning — block
at submit, not at the door; see §4.4).

**Below the cards — three tabs.** This is a fundamentally simpler surface
than reservations: a handful of rows (1 free partnership, occasionally
more), no cross-venue filtering need, no search. `reservations-tabs.svelte`
is the wrong template — it carries a search input, a venue-name filter
`Select`, a clear-filters button, and lazy tab-mounting, all built to manage
reservations *across a whole hospitality portfolio*. None of that applies
here. Build a new, small `custom-partnerships-tabs.svelte` composed
directly from the bare shadcn primitives only —
`Tabs`/`TabsList`/`TabsTrigger` (`@/shared/components/ui/tabs/index.js`) and
`NotificationBadge` (`@/shared/components/ui/notification-badge/index.js`)
for the per-tab counts — with no search box, no filter `Select`, no
clear-filters affordance:

- **Active** — established custom partnerships. New `fetchMyCustomPartnerships`
  query: partnerships where the accommodation is owned by the current user
  AND the hospitality's `createType === 'user'` (platform partnerships stay
  out — they're not "custom"). Same `ConvexDataList` pattern as
  `my-hospitalities/+page.svelte`.
- **Sent** — requests *this user's accommodations* have sent, any status.
  New `fetchMyPartnershipRequestsSent` query, `by_accommodation_owner_status`
  index (unfiltered by status — show all three states in one tab with a
  status badge per row; one query, simplest option). Each row shows the
  target hospitality and a status badge (`pending` / `accepted` /
  `declined`), no actions — the requester just watches.
- **Received** — requests sent *to this user's hospitalities*, that need a
  decision. New `fetchMyPartnershipRequestsReceived` query,
  `by_hospitality_owner_status` filtered to `pending` (accepted/declined
  ones move out of this tab once acted on, avoiding stale actionable-looking
  rows). Each row has **Accept** / **Decline** actions — new
  `partnership-request-item.svelte` composing `ActionButton` (same
  confirm-then-mutate pattern as `change-role-button.svelte` /
  `user-danger-zone` actions) for both.

A user who owns only accommodations (no hospitalities) will simply see an
empty "Received" tab forever — that's correct, not a bug; no need to hide
the tab conditionally.

Empty states across all three reuse the dashed-border empty-card pattern
(`my-hospitalities-empty.svelte` is the template).

### 4.2 Connect flow — `/custom-partnerships/connect`

Same shell as `admin/partnerships/add-partnership/+page.svelte`, but:

- Accommodation picker scoped to the current user's own accommodations only
  — new `select-my-accommodation-dialog.svelte`, trimmed copy of
  `partnerships-select-accommodation-dialog.svelte` querying
  `getUserOwnedAccommodations`-equivalent instead of `fetchAllAccommodations`.
  Skip the picker and preselect if the user owns exactly one accommodation.
- Hospitality picker shows **two pools together**, each row tagged: (a) the
  current user's **own other hospitalities** (any `visibility` — no
  publish gate applies to your own property), and (b) `visibility: "public"`
  hospitalities owned by *other* users (admin-published only, per decision
  #1), excluding pairs that already have an active partnership *or* a
  pending request. New `fetchHospitalitiesForConnect` query, single-select
  (unlike the admin dialog's multi-select — this is a "1 free" flow, not a
  bulk operation), each row showing an "Yours" badge when
  `hospitality.ownerId === ctx.userId` so the instant-vs-request outcome is
  visible before the user commits.
- **CTA label and copy change based on the picked hospitality's ownership**,
  resolved server-side, not just guessed client-side:
  - Same owner → button reads "Connect" — result is immediate, no request
    step.
  - Different owner → button reads "Send partnership request" with a line
    of copy under it ("The hospitality owner needs to accept before this
    becomes active").
- No `benefit` field collected here (unchanged reasoning, §2).
- Submits to `createMyPartnership` (§5.1), which does the ownership check
  itself and returns which branch happened — **never trust the client's
  guess about ownership**, since the picker's "Yours" badge is a UX hint,
  not an authorization decision.

### 4.3 Create-hospitality flow — `/custom-partnerships/create-hospitality`

Unchanged from the original plan: same field set as the admin
add-hospitality form (`hospitalityAddFormSchema`) minus the admin-only
`ownerId` picker, plus the accommodation picker (reused from §4.2) and a
`benefit` field. Always instant — same-owner by construction. Submits to
`createMyHospitality` (§5.2).

### 4.4 Quota block UX (shared by both flows, and by request acceptance)

Per decision #3: when the submit would exceed the free quota, show a
static, non-interactive notice — no button, no link. Copy along the lines
of "You've used your free custom partnership. Pro plan upgrades aren't
available yet — check back soon." New component
`custom-partnership-quota-notice.svelte`, styled like the informational
block already on the landing pricing card but with no CTA slot at all. Form
fields stay filled and visible; only submit is blocked.

**Important addition from decision #2**: quota must also be checked at
**accept time**, not just at connect/create time — a free user could send
(or receive-and-accept) a request that would push them over quota if
another partnership landed in between. `acceptPartnershipRequest` (§5.4)
runs the same quota check as the other two mutations and can itself fail
with the quota-exceeded result; the "Received" tab's Accept button should
surface that failure via the existing toast pattern
(`toastResult` / `safeMutation`), not the full notice component — a toast
is enough for an occasional edge case that isn't the primary flow.

---

## 5. Backend surface to add

Described only — no code in this pass.

### 5.1 `createMyPartnership` — branches instant vs. request

`src/convex/tables/partnerships/mutations/createMyPartnership.ts`,
`authMutation`. Validates caller owns `accommodationId`; target hospitality
exists; no existing active `partnerships.by_pair` row and no existing
*pending* `partnershipRequests.by_pair` row (block duplicate requests, same
defensive pattern `createPartnership` already uses).

Then branches **server-side** on `hospitality.ownerId === ctx.userId`:

- **Same owner** → runs the quota check (§5.3), inserts directly into
  `partnerships`, bumps the counter, tracks `partnership.created`, audits
  `AUDIT_ACTIONS.PARTNERSHIP_CREATE`. Returns `{ success: true, data: {
  mode: 'connected' } }`.
- **Different owner** → does **not** check quota yet (nothing is consumed
  by a request), inserts into `partnershipRequests` with `status:
  'pending'`, tracks a new `partnership.request.created` event, audits a
  new `AUDIT_ACTIONS.PARTNERSHIP_REQUEST_CREATE`. Returns `{ success: true,
  data: { mode: 'requested' } }`.

The client reads `data.mode` to show "Connected!" vs. "Request sent!" in
the success toast — same result envelope shape as every other mutation
here, just one more field. Rate-limit entry: `createMyPartnership:
limitPresets.interactiveWrite`.

### 5.2 `createMyHospitality` (new, self-service) — unchanged from original plan

`src/convex/tables/hospitalities/mutations/createMyHospitality.ts`,
`authMutation`, modeled on `createMyAccommodation` +
`createHospitality`'s upload-resolution logic. Sets `createType: "user"`,
`visibility: "private"`, `ownerId: ctx.userId`. Runs the quota check (§5.3)
since this always creates an active partnership immediately (always
same-owner). Inserts hospitality + partnership + bumps the counter in one
transaction. Tracks `hospitality.claimed` (existing event) +
`partnership.created`. Rate-limit entry: `createMyHospitality:
limitPresets.interactiveWrite`.

### 5.3 Quota check (shared logic, small helper) — timing clarified

`src/convex/tables/partnerships/helpers/enforceCustomPartnershipQuota.ts`,
called from `createMyPartnership`'s same-owner branch,
`createMyHospitality`, and `acceptPartnershipRequest` — i.e. every code
path that is about to insert a row into `partnerships`, and *only* those
paths (never on request creation).

1. Read `analytics.counters.get(ctx, `customPartnerships.count:${userId}`)`
   for the accommodation owner (the party whose quota this is — always the
   accommodation side, never the hospitality side, since "custom
   partnerships" is scoped to what an accommodation has connected, matching
   the landing copy's framing of the accommodation-owner pricing card).
2. Read `plan` off the accommodation owner's user row.
3. `plan === 'pro'` → allow unconditionally.
4. `plan === 'free'` and count `>= 1` → return `{ success: false, message:
   { key: 'GenericMessages.CUSTOM_PARTNERSHIP_QUOTA_EXCEEDED' } }` (new
   message key) — same non-throwing `MutationResult` failure pattern every
   mutation here already uses, so the client renders the quota notice from
   a normal failed-result branch, not a caught exception.
5. Otherwise allow; caller bumps the counter *after* the insert succeeds
   (same ordering `createGuest` uses).

### 5.4 `acceptPartnershipRequest` / `declinePartnershipRequest` (new)

`src/convex/tables/partnerships/mutations/acceptPartnershipRequest.ts` and
`declinePartnershipRequest.ts`, both `authMutation`. Ownership check: caller
must equal the request's `hospitalityOwnerId` (only the receiving side acts
on it — the sender just watches via the "Sent" tab). Both require
`status === 'pending'` on the target row (reject already-resolved requests
with a `GenericMessages`-style "already processed" result, mirroring
`confirmReservation`'s existing `RESERVATION_ALREADY_PROCESSED` pattern).

- **Accept**: takes an additional `benefit` arg (the hospitality owner
  supplies the guest-facing offer here, per §2). Runs the quota check
  (§5.3, against the *accommodation* owner, not the accepting hospitality
  owner). On success: patches the request to `status: 'accepted'`, inserts
  the `partnerships` row, bumps the counter, tracks `partnership.created`,
  audits `AUDIT_ACTIONS.PARTNERSHIP_CREATE`. On quota failure: request stays
  `pending` (nothing consumed, nothing lost — the hospitality owner can
  retry later, e.g. after the requester upgrades).
- **Decline**: patches `status: 'declined'`, tracks a new
  `partnership.request.declined` event, audits a new
  `AUDIT_ACTIONS.PARTNERSHIP_REQUEST_DECLINE`. No counter impact.

Rate-limit entries: both on `limitPresets.interactiveWrite`.

*Optional, not phase-1-required*: email the hospitality owner when a
request lands, reusing the existing Resend integration — the pattern is
already fully built in
`src/convex/tables/reservations/emails/sendReservationEmailToHospitalityOwner.ts`.
Without it, "notification" is simply Convex's normal reactivity: if they
have the Received tab open, it updates live; otherwise they see it next
visit. Fine for v1.

### 5.5 Reads

- `fetchMyCustomPartnerships`, `fetchMyPartnershipRequestsSent`,
  `fetchMyPartnershipRequestsReceived`, `fetchHospitalitiesForConnect` — as
  described in §4.1/§4.2.
- Quota display: extend `getCurrentUser` with `plan` (flows through
  automatically per §2) and optionally a resolved
  `customPartnershipsUsed` count, same "already-subscribed, cheap to
  piggyback" reasoning already documented in that file for
  `hasAccommodations`/`hasHospitalities`.

### 5.6 Admin controls (moved into core scope — decisions #1 and #4 both require these)

Two small admin-only mutations, since both `visibility` and `plan` are now
confirmed as hand-toggled, not self-serve:

- **`setHospitalityVisibility`** — `adminMutation`, args
  `{ hospitalityId, visibility }`, single-field patch, mirrors the shape of
  `setUserRole` (`src/convex/tables/users/userMutations.ts`) exactly.
  Surfaced as a small action on the existing `admin/hospitalities/+page.svelte`
  row actions or the hospitality detail/edit view — a toggle button, not a
  new page. Audits a new `AUDIT_ACTIONS.HOSPITALITY_VISIBILITY_UPDATE`.
- **`setUserPlan`** — `adminMutation`, args `{ userId, plan }`, same shape
  as `setUserRole`. Surfaced on the admin user detail page
  (`admin/users/[id]/+page.svelte`), same location/pattern as
  `change-role-button.svelte` in `user-danger-zone/` — a parallel
  `change-plan-button.svelte` showing current plan and a toggle/select to
  the other value. Audits a new `AUDIT_ACTIONS.USER_PLAN_UPDATE`.

Since neither `plan` nor `visibility` has any other write path in phase 1,
these two mutations are **not optional polish** — without them the feature
is inert (every hospitality stays private forever, every user stays on
`free` forever). Build these alongside §5.1/§5.2, not after.

### 5.7 Backfill migrations

- `backfillHospitalityCreateTypeInternal.ts` — sets `createType: "platform"`,
  `visibility: "public"` on every existing hospitality row. Run once, after
  the schema migration, before any self-service creation ships.
- `backfillCustomPartnershipCountersInternal.ts` — initializes
  `customPartnerships.count:{userId}` for any user who already has
  user-created hospitality partnerships (should be zero today, but written
  for idempotent safety).

---

## 6. i18n

New message groups in `messages/en.json` (+ Serbian, subject to the
existing translation-gap tracked separately):

- `ProtectedSidebar.customPartnerships`
- `CustomPartnershipsPage.*` — hub title/description, quota badge variants,
  both card titles/bodies/CTAs, the three tab labels, request-row status
  badges (pending/accepted/declined), accept/decline confirm-dialog copy
  (mirror `ChangeRoleButton`'s promote/demote title+description pairing),
  the quota notice copy (no CTA text needed per decision #3).
- Connect-flow and create-hospitality-flow labels can mostly alias existing
  `AddHospitalityPage`/`AdminPartnershipAddPage` keys where copy is
  identical.
- New `GenericMessages` keys: `CUSTOM_PARTNERSHIP_QUOTA_EXCEEDED`,
  `PARTNERSHIP_REQUEST_ALREADY_PROCESSED`,
  `PARTNERSHIP_REQUEST_NOT_FOUND`.

---

## 7. Suggested phased build order

1. **Schema**: `hospitalities.createType` + `visibility` + index, new
   `partnershipRequests` table, backfill migration. `users.plan` +
   `planExpiresAt` via `additionalFields` + `auth generate` + codegen.
2. **Admin controls first** (§5.6) — `setHospitalityVisibility` +
   `setUserPlan`, plus their small UI surfaces on existing admin pages.
   Nothing downstream is testable without these, since they're the only way
   any hospitality ever becomes public or any user ever becomes Pro.
3. **Backend**: `createMyPartnership` (both branches), `createMyHospitality`,
   `acceptPartnershipRequest`/`declinePartnershipRequest`, the quota helper,
   all new read queries, rate-limit registry entries, new audit actions.
4. **Routes + nav**: the three route files, sidebar entry, hub page with
   the two cards + three tabs, using the existing admin dialogs' queries
   swapped in directly (skip the trimmed picker components initially).
5. **New scoped picker dialogs** (`select-my-accommodation-dialog`,
   `fetchHospitalitiesForConnect`-backed picker with the "Yours" badge) once
   step 4 is functionally proven end to end.
6. **Quota badge, quota notice component, request accept/decline UI
   polish, i18n completion.**

Payments/real Pro billing stays explicitly **out of scope** — `plan` is
hand-toggled via `setUserPlan` (§5.6) until a payment provider is chosen.
