# Piton Analytics Convex — Library Enhancement Prompt

Copy everything below this line into your LLM session for the `piton-analytics-convex` library.

---

Enhance `@piton-/analytics-convex` for dashboard metric health labels, funnel conversions, and multi-metric reads.

Read the library README and respect existing package structure (`src/component/`, `src/client/`, `src/shared/`), rollup-only dashboard reads, scopes, `ANALYTICS_LIMITS`, and the `authorize` callback model.

## Context — consumer app

We use piton-analytics-convex for in-product analytics. Events and metrics are defined in app `convex/analytics.ts` with a hospitality funnel:

- `qrScans` → `guestActivations` → `hospitalityViews` → `newReservations` → `confirmedReservations` / `cancelledReservations`
- Also: partnerships, accommodations, hospitalities, guest sessions, etc.

### What we already use

- `writeTrack` / scheduled ingestion
- `fetchTimeSeries`, `fetchSummary`, `fetchBreakdown`
- `fetchMetricTotalsByDimension`, `fetchTopDimensionValue`, `getAnalyticsRanking`
- `fetchMetricComparison` (e.g. 30-day current vs equal-length previous period) for user analytics

### What we do NOT have — and currently hack in consumer apps

UI shows uniform metric badges: `Neutral`, `Activity`, `Good`, `Excellent`, `Bad`, `Clear`.

Label rules live in app code with placeholder constants (25% growth = excellent, 50% conversion = excellent, 25% cancellation = bad). These are not product-validated standards.

Gaps:

1. **No funnel conversion API** — apps manually compute `guestActivations / qrScans`, `confirmedReservations / newReservations`, etc.
2. **No metric health / label evaluation** — `fetchMetricComparison` returns numbers only; every app reimplements label logic.
3. **No threshold configuration on metrics** — thresholds should live in `defineAnalytics` metric config, not in each consumer app.
4. **No guardrails for low-volume noise** — small counts make `deltaPercent` misleading (1→3 = +200% “Excellent”).
5. **No batch dashboard read** — dashboard pages fire many parallel summary/comparison queries.
6. **No first-class funnel definitions** — funnel relationships are implicit in app code.

---

## Requested features

### 1. Metric evaluation config (in `defineAnalytics`)

Extend the metric builder API:

```ts
guestActivations: count("Guest activations")
  .from("guest.activated")
  .by("accommodationId")
  .evaluation({
    kind: "comparison",
    excellentGrowthPercent: 25,
    goodGrowthPercent: 5,
    badGrowthPercent: -5,
    minVolumeForComparison: 10,
  }),

guestActivations: count("Guest activations")
  .from("guest.activated")
  .evaluation({
    kind: "conversion",
    denominatorMetric: "qrScans",
    excellentRatePercent: 50,
    goodRatePercent: 20,
    badRatePercent: 10,
    minDenominator: 5,
  }),

cancelledReservations: count("Cancelled reservations")
  .from("reservation.cancelled")
  .evaluation({
    kind: "inverseRate",
    denominatorMetric: "newReservations",
    badRatePercent: 25,
    goodRatePercent: 10,
  }),
```

Export shared types:

- `AnalyticsMetricLabel = "neutral" | "activity" | "good" | "excellent" | "bad" | "clear"`
- `MetricEvaluationConfig` as a discriminated union by `kind`

Store evaluation config in component runtime config (like events/metrics). Readable via `analytics.config`.

### 2. New query: `fetchMetricConversion`

Rollup-based conversion between two metrics over the same range:

```ts
fetchMetricConversion(ctx, {
  numeratorMetric: "guestActivations",
  denominatorMetric: "qrScans",
  from,
  to,
  scope?,
})
// → { numerator, denominator, ratePercent, range }
```

Support global, organization, and resource scopes. Optional dimension filter if feasible.

### 3. New query: `fetchMetricEvaluation`

Single metric label for a period:

```ts
fetchMetricEvaluation(ctx, {
  metric: "guestActivations",
  from,
  to,
  scope?,
})
// → {
//   label: AnalyticsMetricLabel,
//   value: number,
//   comparison?: { current, previous, delta, deltaPercent },
//   conversion?: { numerator, denominator, ratePercent },
//   meta: { reason: "below_min_volume" | "zero_previous" | ... }
// }
```

Use the metric’s `.evaluation()` config. Implement pure evaluation logic in `src/shared/` for tests; component query calls it.

### 4. New query: `fetchDashboardMetrics`

Batch read for dashboard cards:

```ts
fetchDashboardMetrics(ctx, {
  metrics: ["qrScans", "guestActivations", "newReservations"],
  from,
  to,
  scope?,
  includeComparison: true,
  includeEvaluation: true,
})
// → Record<metricName, {
//   value,
//   comparison?,
//   evaluation: { label },
//   conversion?: { ratePercent, denominatorMetric }
// }>
```

Optimize rollup reads where possible. Respect `maxRollupRowsPerQuery`.

### 5. Funnel config (preferred)

Allow declaring funnels in `defineAnalytics`:

```ts
funnels: {
  guestActivation: {
    label: "Scan to activation",
    steps: ["qrScans", "guestActivations"],
  },
  reservationConfirmation: {
    steps: ["newReservations", "confirmedReservations"],
  },
},
```

Expose:

```ts
fetchFunnelConversion(ctx, { funnel: "guestActivation", from, to, scope? })
```

### 6. Low-volume / edge-case rules

Document and implement standard label behavior:

| Case                                          | Label                                        |
| --------------------------------------------- | -------------------------------------------- |
| `previous = 0`, `current > 0`                 | `activity`                                   |
| `previous = 0`, `current = 0`                 | `neutral`                                    |
| below `minVolumeForComparison`                | `neutral` (avoid excellent on noise)         |
| conversion `denominator = 0`, `numerator > 0` | `good` or `activity` (pick one, document it) |
| inverse rate = 0%                             | `clear`                                      |

### 7. App-side exports

Export from package client:

- `evaluateMetricLabel(result, config)` — pure function for UI reuse
- optional `ANALYTICS_METRIC_LABELS` display map (apps may override)

Add matching server helpers on the `analytics` object.

### 8. Tests

Cover:

- comparison evaluation (growth thresholds, negative → bad)
- conversion evaluation (excellent/good/bad bands, min denominator)
- inverse rate evaluation
- low-volume guard (small deltas must not become excellent)
- `fetchDashboardMetrics` parity vs individual queries

---

## Non-goals (this pass)

- Marketing / web page analytics
- `distinctCount` / actor cardinality metrics
- Persisting labels into rollup tables (labels are query-time only)

---

## Deliverables

1. Config/schema changes if needed (prefer existing runtime config pattern)
2. Component queries + `src/component/lib.ts` exports
3. Client builders + `defineAnalytics` / `createAnalyticsApi` typings
4. README section: **Metric evaluation & funnel conversions** with hospitality funnel examples
5. Migration notes for apps using manual `deltaPercent` logic and hardcoded thresholds
6. Run tests, typecheck, lint, build, regenerate codegen

Follow existing file boundaries. Never scan raw events for dashboard queries — use `analyticsDailyMetrics` rollups only.
