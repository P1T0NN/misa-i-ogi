// TYPES
import type {
	typesMetricComparisonInput,
	typesMetricEvaluationResult
} from '@piton-/analytics-convex';
import type { AnalyticsMetricDelta } from '../types/analyticsTypes';

/**
 * Turn the backend period-over-period comparison into a display-ready delta.
 * `deltaPercent` is omitted by the backend when the previous window was zero
 * (division by zero) — we surface that as "no prior activity" rather than a
 * misleading ∞%. Sentiment comes from the backend evaluation so metric-specific
 * meaning is respected (e.g. cancellations rising reads as negative, not positive).
 */
export function buildMetricDelta(
	comparison: typesMetricComparisonInput,
	evaluation?: typesMetricEvaluationResult
): AnalyticsMetricDelta {
	const direction =
		comparison.delta > 0 ? 'up' : comparison.delta < 0 ? 'down' : 'flat';

	const sentiment =
		evaluation?.sentiment ??
		(direction === 'up' ? 'positive' : direction === 'down' ? 'negative' : 'neutral');

	const hasPrevious = comparison.previous > 0 && comparison.deltaPercent !== undefined;

	return {
		deltaPercent: hasPrevious ? Math.round(comparison.deltaPercent as number) : undefined,
		direction,
		sentiment
	};
}
