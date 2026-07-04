/**
 * Client-side mirror of the server pro-trial gates (`ensure*Access` helpers)
 * for gating UI. One account-level state shared by every Pro-gated feature
 * (custom partnerships, hospitality creation):
 * - `pro` — unlimited, no trial involved.
 * - `trial-available` — never started; first custom partnership or the Add
 *   Hospitality "Start free trial" button starts it.
 * - `trial-active` — running; `proTrialEndsAt` is the deadline.
 * - `trial-expired` — over forever; blocked until Pro ships.
 *
 * UX hint only — the server re-checks on every write.
 */
export type ProAccess = 'pro' | 'trial-available' | 'trial-active' | 'trial-expired';
