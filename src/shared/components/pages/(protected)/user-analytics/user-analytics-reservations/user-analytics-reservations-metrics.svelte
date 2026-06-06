<script lang="ts">
	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/analytics-display-formatters';

	// TYPES
	import type { UserAnalyticsReservationsPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type { AnalyticsMetric } from '@/features/analytics/types/analyticsTypes';

	let { metrics }: { metrics: UserAnalyticsReservationsPageMetrics } = $props();

	const displayMetrics = $derived<AnalyticsMetric[]>([
		createComparedAnalyticsMetric({
			id: 'created',
			label: 'Created',
			metric: metrics.created
		}),
		createComparedAnalyticsMetric({
			id: 'confirmed',
			label: 'Confirmed',
			metric: metrics.confirmed
		}),
		createComparedAnalyticsMetric({
			id: 'cancelled',
			label: 'Cancelled',
			metric: metrics.cancelled
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
