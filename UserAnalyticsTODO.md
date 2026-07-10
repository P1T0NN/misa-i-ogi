# UserAnalyticsTODO.md — honest UX review of owner analytics

> **STATUS 2026-07-10: all items below implemented.** Typecheck + production build clean.
> Summary of what shipped:
> - **A1** — detail-page "Activity trend" charts removed (per-entity time series isn't reliably
>   available in the analytics lib without top-N risk). Detail pages stay correct: per-entity tiles +
>   per-entity performance table.
> - **A2** — tiles now show the **real** period-over-period delta ("↑ 12% vs previous 30 days") with
>   backend-driven sentiment colour; the fake presence badge is gone for compared metrics.
> - **A3 + A4** — Overview and Reservations trend charts switched to `LineChartInteractive`
>   (metric toggles + one clean line). This removed the misleading time-range pickers entirely and
>   eliminated the stacked-funnel distortion.
> - **A5** — partner-table copy reworded to owner-scope reality (no false per-pair attribution).
> - **B1/B2** — hardcoded "Tracked …: 1" tiles and owned-count tiles deleted; every page's tile row is
>   now the funnel (scans → activations → reservations → confirmed).
> - **B3** — unused computed metrics removed from the hospitality-detail and reservations queries.
> - **B4 + C1** — Overview rebuilt: one tile row + one combined trend chart + the two top tables.
> - **C2** — "Last 30 days" chip added to every analytics page header.
> - **C3** — reservations funnel reads Requests → Confirmed → Cancelled.
> - **C5** — loading skeletons realigned (delta line, matched column counts). Sortable performance
>   columns intentionally deferred: DataTable sorting is server-pagination-driven and doesn't fit these
>   static top-N tables; revisit if those tables move to paginated queries.
>
> Original review preserved below for reference.

---


Reviewed 2026-07-10: `/analytics/overview`, `/analytics/accommodations`, `/analytics/accommodations/[id]`,
`/analytics/hospitalities`, `/analytics/hospitalities/[id]`, `/analytics/reservations` — frontend components
and the Convex queries behind them.

**Verdict up front:** the skeleton is genuinely good — consistent page shell (header → tiles → chart → table),
polished loading/empty states, a small coherent metric vocabulary (scans → activations → views → requests →
confirmed), tabular numerals, responsive columns. What stands between this and "ah, I love these analytics" is
not more features. It's that several displayed numbers/visuals are **not what they claim to be**, plus some
tiles that are pure noise. Fix the trust issues, delete the noise, and this is production-ready.

---

## A. Trust breakers — fix before launch (users WILL notice)

### A1. Detail-page "Activity trend" charts show OWNER-WIDE data, not the entity's ⚠ worst issue
- `fetchUserAnalyticsAccommodationPage.ts` — metric tiles are per-accommodation
  (`fetchMetricTotalsByDimension` + `getAnalyticsMetricValue(totals, accommodationId)`), but the three
  `fetchTimeSeries` calls for the chart use `ownerScope` with **no accommodation filter**.
- `fetchUserAnalyticsHospitalityPage.ts` — same: per-venue tiles, owner-wide chart series.
- Symptom: owner with 3 accommodations opens one, tile says "4 QR scans", chart shows 40. The page contradicts
  itself on first glance. For single-venue owners it happens to look right, which makes it worse — it will
  surface exactly when a customer grows.
- Fix: fetch the time series filtered by the entity dimension (or group-by dimension and pick the entity's
  series). If the analytics lib can't filter series per dimension yet, drop the chart from detail pages until
  it can — a wrong chart is worse than no chart.

### A2. Sentiment badges are fake signal
- `createComparedAnalyticsMetric` ignores the real 30-vs-previous-30 comparison the backend already computes
  (`includeComparison: true`) and derives the badge from `getPresenceAnalyticsLabel(value)`:
  **any value > 0 → green "Good", 0 → "Clear"**. Every non-zero tile is permanently "Good".
- A badge that always says Good is noise the first week and a credibility hole the first time someone's
  numbers drop 40% and it still says Good.
- Fix (pick one):
  1. **Best:** show the real delta — "↑ 12% vs previous 30 days" — data is already returned.
  2. **Lazy-valid:** delete the badges entirely. Plain number + label is honest and calm.
  - Do not keep the presence-based version.

### A3. Time-range selector promises data that was never fetched
- The interactive area charts offer "Last 3 months / 30 days / 7 days / Custom", but every query is hardcoded
  to `ANALYTICS_QUERY_RANGE_DAYS = 30`. Selecting "Last 3 months" silently renders the same 30 days.
  Custom range happily lets you pick a year.
- Fix (pick one):
  1. Restrict the options to "Last 30 days / Last 7 days" (and cap Custom to the fetched window).
  2. Or actually fetch 90 days and let the selector be real.
  - Option 1 is a 5-minute fix and fine for launch.

### A4. Stacked areas for funnel metrics read as parts-of-a-whole
- `AreaChartInteractive` defaults to `seriesLayout = 'stack'`. The accommodation-detail chart stacks
  QR scans + guest activations + reservations — three stages of the same funnel, not additive quantities.
  Stacked, the top edge is a meaningless "total events" line and each band's height is hard to read.
- Same on the reservations status chart: created + confirmed + cancelled are overlapping populations
  (confirmed/cancelled are outcomes of created) — stacking double-counts.
- Fix: pass overlapping layout (non-stacked, semi-transparent) or switch multi-series charts to lines.
  Lines are the boring-correct choice for comparing funnel stages over time.

### A5. Partner-table copy overpromises attribution
- Accommodation detail table says "Hospitalities guests opened **from this accommodation**", but views/requests
  are keyed only by `hospitalityId` at owner scope — they're that hospitality's totals across ALL the owner's
  accommodations, not attribution from this one. Mirror issue on hospitality detail ("Accommodations that send
  guests to this hospitality" — actually those accommodations' totals).
- Fix: soften the copy to what the data is ("Partner hospitality activity in the last 30 days") until real
  per-pair attribution exists. Copy that claims precision the data doesn't have is how owners catch you.

---

## B. Noise — delete these

### B1. "Tracked accommodations: 1" / "Tracked hospitalities: 1" tiles (detail pages)
Hardcoded `1` (`trackedStays: { value: 1 }`). A tile telling the user that the page about one venue covers
one venue, with a "Good" badge on it. Pure noise — delete, and let the remaining 3 tiles breathe.

### B2. "Accommodations" / "Hospitalities" count tiles (list pages)
Owned-entity count is static account info, not analytics — the owner knows how many venues they have, and it
never changes week to week. Cut the tile; the sidebar and My Accommodations already say this. (If you want a
4th tile, "Confirmed reservations" is the obvious replacement — it completes the funnel and feeds the
Conversion column users see in the table below.)

### B3. Unused computed metrics (backend cost, zero UI)
- Hospitality detail: `guestActivations` is computed (summed over partner accommodations) and returned but
  never rendered; the chart data also carries a `guestActivations` series with no chartConfig entry.
- Reservations page: `trackedVenues` returned, never rendered.
- Either render them or stop computing them — currently they're silent query cost.

### B4. Three separate full-width charts on Overview
QR scans, guest activations, reservations as three stacked ~300px cards, each with its own range selector =
three screens of scrolling to see three numbers' shape, and three range pickers to keep in sync. This is the
single biggest cognitive-load item. See C1.

---

## C. Structure — what I'd change (UX opinion)

### C1. Invert the Overview page ("the 5-second rule")
Today Overview is the only page with NO metric tiles — you land on charts and must eyeball slopes to get
numbers. Owners open Overview to answer "how's it going?" in 5 seconds. Restructure to the same shell as
every other page:
1. **One tile row:** QR scans · Guest activations · Reservations · Confirmed (30-day totals, real deltas per A2).
2. **One combined trend chart** (multi-line: scans / activations / reservations — one range selector).
3. Top accommodations + Top hospitalities tables (keep as-is, they're good).
This also fixes the inconsistency that Overview is the only page breaking the tiles→chart→table pattern.

### C2. Say what the window is
Nothing on any page says "last 30 days". Tiles read as maybe-lifetime numbers. One muted line under the page
header ("Last 30 days · updated daily") — or in each card description — kills the ambiguity for free.
This matters double because tile (30d window) and chart (client-filterable) can currently disagree.

### C3. Reservations page: "Created" naming
Everywhere else `newReservations` is labeled "Reservations"; on the reservations page it becomes "Created".
Pick one word for one concept — suggest "Requests" or "Reservation requests" platform-wide, since that's what
they are (guests request, owners confirm). Then Created/Confirmed/Cancelled → Requests/Confirmed/Cancelled and
the funnel reads instantly.

### C4. Keep (don't touch — this is the good part)
- The per-page shell: header → tiles → chart → table. Consistent, predictable, calm.
- Loading skeletons (layout-matched) and dashed-border empty states. Genuinely production-quality.
- Top-5 tables with Details links as the path into detail pages; breadcrumb as the way back. Fine as-is —
  no tabs needed, the sidebar's 4 analytics entries are the right IA.
- Small metric vocabulary. Do NOT add more metrics (bounce rates, session times, etc.) — the restraint is
  a feature. Six numbers an owner understands beat twenty they don't.
- Conversion column (confirmed/requests) — the single most actionable number on the site. Keep it everywhere.

### C5. Nice-to-have, not launch-blocking
- Sortable columns on the performance tables (shared DataTable already supports sorting — currently opted out).
  Owners will want "sort by conversion".
- Reservations loading skeleton renders 3-col grid but live page uses the 4-col metric grid — cosmetic mismatch.
- Detail-page charts at `h-80` with 3 series but tiles often showing single digits: consider hiding the chart
  below a data threshold and showing "Not enough activity yet" — a flat-zero chart with a legend is dead weight
  for small venues (which is most venues at launch).

---

## D. Suggested execution order

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 1 | A1 per-entity chart series (or drop detail charts) | M | Trust |
| 2 | A2 real deltas on tiles (or delete badges) | S–M | Trust |
| 3 | A3 clamp time-range options to 30d | S | Trust |
| 4 | B1+B2 delete Tracked/count tiles | S | Less noise |
| 5 | A4 unstack funnel/status charts | S | Readability |
| 6 | C1 Overview: tiles + one chart | M | Biggest UX win |
| 7 | C2 "Last 30 days" label on pages | S | Clarity |
| 8 | A5 + C3 copy fixes (attribution wording, Created→Requests) | S | Honesty |
| 9 | B3 stop computing unused metrics | S | Hygiene |
| 10 | C5 nice-to-haves | S–M | Polish |

Items 1–5 are what I'd call launch-gating (per ProductionTODOS.md conventions); 6–8 are the "love it" layer;
9–10 whenever.
