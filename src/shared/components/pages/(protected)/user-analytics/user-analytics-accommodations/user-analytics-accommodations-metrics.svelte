<script lang="ts">
	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';
	import { formatAnalyticsCount } from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

	// TYPES
	import type { UserAnalyticsAccommodationsPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsAccommodationsPageMetrics } = $props();

	const displayMetrics = $derived([
		{
			id: 'accommodations',
			label: 'Accommodations',
			value: formatAnalyticsCount(metrics.trackedStays.value)
		},
		createComparedAnalyticsMetric({
			id: 'qr-scans',
			label: 'QR scans',
			metric: metrics.qrScans
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
