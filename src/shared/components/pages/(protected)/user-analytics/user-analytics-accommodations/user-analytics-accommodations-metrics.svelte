<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

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
			label: m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsMetrics.accommodations'](),
			value: formatAnalyticsCount(metrics.trackedStays.value)
		},
		createComparedAnalyticsMetric({
			id: 'qr-scans',
			label: m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsMetrics.qrScans'](),
			metric: metrics.qrScans
		}),
		createComparedAnalyticsMetric({
			id: 'guest-activations',
			label: m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsMetrics.guestActivations'](),
			metric: metrics.guestActivations
		}),
		createComparedAnalyticsMetric({
			id: 'requests-generated',
			label: m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsMetrics.reservations'](),
			metric: metrics.requestsGenerated
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
