<script lang="ts">
	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';
	import { formatAnalyticsCount } from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

	// TYPES
	import type { UserAnalyticsHospitalitiesPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsHospitalitiesPageMetrics } = $props();

	const displayMetrics = $derived([
		{
			id: 'hospitalities',
			label: 'Hospitalities',
			value: formatAnalyticsCount(metrics.trackedVenues.value)
		},
		createComparedAnalyticsMetric({
			id: 'guest-views',
			label: 'Guest views',
			metric: metrics.hospitalityViews
		}),
		createComparedAnalyticsMetric({
			id: 'guest-activations',
			label: 'Guest activations',
			metric: metrics.guestActivations
		}),
		createComparedAnalyticsMetric({
			id: 'requests-generated',
			label: 'Reservations',
			metric: metrics.requestsGenerated
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
