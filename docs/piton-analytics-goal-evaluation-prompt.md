# Library enhancement: `goal` metric evaluation kind

## Context

`@piton-/analytics-convex` already supports metric `.evaluation()` with three kinds:

- `comparison` — period-over-period growth %
- `conversion` — numerator ÷ denominator rate %
- `inverseRate` — lower rate is better

Consumer apps (e.g. MisaIOgi hospitality platform) need a **fourth kind**: compare the
metric’s **actual rollup total** for a date range against a **fixed product goal /
benchmark** (absolute target), then return the same label vocabulary
(`neutral` | `activity` | `good` | `excellent` | `bad` | `clear`).

**Policy:** All analytics evaluation features live in the library. Consumers configure
goals in `convex/analytics.ts` via `.evaluation()` — no app-side threshold math.

Read the current codebase on disk (version **0.1.24** or later). Follow existing
patterns in:

- `src/shared/types/evaluation.ts`
- `src/shared/utils/analyticsEvaluationUtils.ts`
- `src/component/helpers/evaluateMetricForRange.ts`
- `src/component/validations/configurationLimits.ts`
- `src/test/`
- `README.md` (Types section)
- `CONSUMER-MIGRATION.md`

Do not import from `src/shared/*` or `src/component/*` in consumer apps — only from
`@piton-/analytics-convex` package entry (`src/client/index.ts`).

---

## Problem

`conversion` answers: “What % of QR scans became activations?”

`comparison` answers: “Did we grow vs last period?”

Neither answers: “Did we hit our **target** of 500 QR scans this month?”

Consumers cannot express absolute goals without forking evaluation logic. Add a
library-native `goal` evaluation kind.

---

## Proposed API

### Metric builder config

```ts
qrScans: count("QR scans")
  .from("qr.scanned")
  .evaluation({
    kind: "goal",
    targetValue: 500,
    excellentPercentOfGoal: 100,
    goodPercentOfGoal: 75,
    badPercentOfGoal: 50,
    minValueForEvaluation: 0, // optional; below this total → neutral
  }),
```

### Semantics

- **`targetValue`** — absolute goal for the **queried `from`–`to` range**. The
  consumer sets the target for that window (e.g. `500` for a 30-day admin dashboard).
  Document clearly: this is not auto-prorated to calendar months in v1.
- **`percentOfGoal`** — `(value / targetValue) * 100` when `targetValue > 0`.
- Labels (higher % of goal is better):
  - `percentOfGoal >= excellentPercentOfGoal` → `excellent`
  - `percentOfGoal >= goodPercentOfGoal` → `good`
  - `percentOfGoal <= badPercentOfGoal` → `bad`
  - otherwise → `neutral`
- Optional **`minValueForEvaluation`** — if `value < min`, return `neutral` with
  reason `below_min_volume` (reuse existing reason name).

### Edge cases (document + test)

| Case                                       | Label                                            | Reason                 |
| ------------------------------------------ | ------------------------------------------------ | ---------------------- |
| `targetValue === 0`                        | `neutral`                                        | `zero_target`          |
| `targetValue > 0`, `value === 0`           | `bad` if `0 <= badPercentOfGoal`, else `neutral` | `goal_progress`        |
| `value > 0`, `percentOfGoal` between bands | `neutral`                                        | `goal_progress`        |
| no `.evaluation()` config                  | `neutral`                                        | `no_evaluation_config` |
| below `minValueForEvaluation`              | `neutral`                                        | `below_min_volume`     |

Do **not** use `activity` for goal evaluation. `activity` remains for comparison
edge cases (`zero_previous` with `current > 0`) only.

### Validation (`configurationLimits.ts`)

- `targetValue` must be `> 0`
- `excellentPercentOfGoal >= goodPercentOfGoal >= badPercentOfGoal`
- All percent fields `>= 0` (allow `> 100` for stretch goals)

---

## Query response extension

Extend dashboard / evaluation responses with an optional **goal block** (mirror
`conversion`):

```ts
goal?: {
  targetValue: number;
  value: number;
  percentOfGoal?: number;
};
```

Apply to:

- `typesDashboardMetricItem`
- `typesMetricEvaluationResponse`
- Convex validators in `src/shared/schemas/evaluationSchemas.ts` (or equivalent)

`fetchDashboardMetrics` and `fetchMetricEvaluation` must populate `goal` when
`evaluation.kind === "goal"`.

**No extra rollup reads** — goal uses the metric’s existing total for the range.

---

## Implementation checklist

### 1. Types (`src/shared/types/evaluation.ts`)

- Add `typesMetricGoalEvaluationConfig`:

  ```ts
  export type typesMetricGoalEvaluationConfig = {
  	kind: 'goal';
  	targetValue: number;
  	excellentPercentOfGoal: number;
  	goodPercentOfGoal: number;
  	badPercentOfGoal: number;
  	minValueForEvaluation?: number;
  };
  ```

- Add `typesMetricGoalInput`:

  ```ts
  export type typesMetricGoalInput = {
  	value: number;
  	targetValue: number;
  	percentOfGoal?: number;
  };
  ```

- Extend `typesMetricEvaluationConfig` union with `typesMetricGoalEvaluationConfig`
- Extend `typesMetricEvaluationInput` union:

  ```ts
  | {
      kind: "goal";
      goal: typesMetricGoalInput;
      config: typesMetricGoalEvaluationConfig;
    }
  ```

- Add evaluation reasons: `goal_progress`, `zero_target`
- Export all new types from `src/shared/types/index.ts` and `src/client/index.ts`

### 2. Pure utils (`src/shared/utils/analyticsEvaluationUtils.ts`)

- Add `computePercentOfGoal({ value, targetValue })` — pure export (parallel to
  `computeConversionRatePercent`). Return `undefined` when `targetValue === 0`.
- Add `evaluateGoalLabel(goal, config)` — pure, fully tested
- Wire `kind: "goal"` into `evaluateMetricLabel` switch

### 3. Component (`src/component/helpers/evaluateMetricForRange.ts`)

- Handle `evaluation.kind === "goal"` in `internalBuildMetricEvaluationFromCache`
- No denominator or previous-period reads for goal
- Return `goal` block on build result alongside `evaluation`
- Ensure `collectDashboardMetricTotalRequests` does not add extra reads for goal
  metrics (only the metric total for the range)

### 4. Builder + config serialization

- Metric builder `.evaluation()` accepts `kind: "goal"`
- Config hash, `writeConfiguration`, validators, and limits include new shape
- Update `configurationLimits.ts` validation rules listed above

### 5. Schemas

- Add goal validators to shared/component schemas
- Update `dashboardMetricItemValidator` (or equivalent) with optional `goal` block

### 6. Tests

- Unit tests in `src/test/shared/` for `evaluateGoalLabel` and `computePercentOfGoal`
- Cover all edge cases in the table above
- Component tests: `fetchDashboardMetrics` / `fetchMetricEvaluation` with goal config
- Validation tests for invalid goal configs (zero target, inverted percents)
- All existing evaluation tests must still pass

### 7. Documentation

- **README.md** — add `goal` to evaluation kinds table, Types section example, server
  helper notes
- **CONSUMER-MIGRATION.md** — new subsection with before/after and MisaIOgi mapping
- **CHANGELOG.md** — version bump (minor)

---

## Consumer migration example (MisaIOgi)

### Before (presence label in UI — app-side)

```ts
// convex/analytics.ts — no evaluation on qrScans
qrScans: count("QR scans").from("qr.scanned").by("accommodationId", "scanType"),

// UI: getPresenceAnalyticsLabel(value) → activity/neutral only
```

### After (goal in library)

```ts
qrScans: count("QR scans")
  .from("qr.scanned")
  .by("accommodationId", "scanType")
  .evaluation({
    kind: "goal",
    targetValue: 1000,
    excellentPercentOfGoal: 100,
    goodPercentOfGoal: 80,
    badPercentOfGoal: 50,
  }),
```

```ts
// UI: use dashboard.metrics.qrScans.evaluation.label from fetchDashboardMetrics
// Optional display: dashboard.metrics.qrScans.goal?.percentOfGoal
```

### Suggested MisaIOgi goal mapping (reference — consumer tunes values)

| Metric                  | kind                   | Notes                                        |
| ----------------------- | ---------------------- | -------------------------------------------- |
| `qrScans`               | `goal`                 | Platform scan volume target for 30-day range |
| `hospitalityViews`      | `goal`                 | Discovery volume target                      |
| `guestActivations`      | `conversion`           | Keep — rate vs QR scans                      |
| `newReservations`       | `comparison` or `goal` | Growth vs target depending on product choice |
| `cancelledReservations` | `inverseRate`          | Keep — cancellation rate vs requests         |

After library release, consumer runs `analytics:writeConfiguration` (or equivalent)
after changing `convex/analytics.ts`.

---

## Explicitly out of scope (v1)

- Per-organization / per-user goals stored in DB
- Admin UI to edit goals at runtime
- Auto-prorating monthly goals to arbitrary date ranges (document that `targetValue`
  applies to the query range; optional v2: `targetBasis: "perMonth"` + proration)
- Replacing `comparison` / `conversion` / `inverseRate` — goal is additive
- Persisting labels or goal progress in rollup tables
- New query type beyond existing `fetchMetricEvaluation` / `fetchDashboardMetrics`

---

## Architecture rules (do not break)

- Dashboard reads → rollups only (`analyticsDailyMetrics`), never raw events
- Labels → query time only, not stored in rollups
- Pure evaluation in `shared/utils` — safe for UI via `evaluateMetricLabel` and
  `computePercentOfGoal`
- `internal*` prefix for component-only helpers; consumers never call them
- Public exports only from `@piton-/analytics-convex` entry
- Regenerate codegen: `npm run build:codegen`
- Run full test suite before release

---

## Acceptance criteria

1. `kind: "goal"` works on `.evaluation()` in `defineAnalytics` metrics.
2. `evaluateMetricLabel` returns correct labels for goal configs.
3. `fetchDashboardMetrics` and `fetchMetricEvaluation` include `goal` block when
   applicable.
4. `computePercentOfGoal` exported from package entry.
5. All existing evaluation tests pass; new tests cover goal edge cases.
6. README, CONSUMER-MIGRATION, and CHANGELOG updated.
7. No breaking changes to existing evaluation kinds.

---

## Deliverables

1. Full implementation in the library repo
2. Updated tests (green)
3. Updated README + CONSUMER-MIGRATION + CHANGELOG
4. Short summary of files changed and example consumer diff for MisaIOgi
