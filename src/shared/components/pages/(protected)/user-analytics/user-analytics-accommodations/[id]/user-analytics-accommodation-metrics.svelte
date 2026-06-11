<script lang="ts">
	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import {
		createComparedAnalyticsMetric,
		createStaticAnalyticsMetric
	} from '@/features/analytics/utils/createAnalyticsMetric';
	import { getPresenceAnalyticsLabel } from '@/features/analytics/utils/analyticsLabelUtils';

	// TYPES
	import type { UserAnalyticsAccommodationsPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsAccommodationsPageMetrics } = $props();

	const displayMetrics = $derived([
		createStaticAnalyticsMetric({
			id: 'tracked-stays',
			label: 'Tracked stays',
			metric: metrics.trackedStays,
			analyticsLabel: getPresenceAnalyticsLabel(metrics.trackedStays.value)
		}),
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
