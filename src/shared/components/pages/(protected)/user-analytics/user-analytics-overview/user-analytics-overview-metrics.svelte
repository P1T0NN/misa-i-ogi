<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';

	// TYPES
	import type { UserAnalyticsOverviewPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsOverviewPageMetrics } = $props();

	const displayMetrics = $derived([
		createComparedAnalyticsMetric({
			id: 'qr-scans',
			label: m['AnalyticsOverviewPage.UserAnalyticsOverviewMetrics.qrScans'](),
			metric: metrics.qrScans
		}),
		createComparedAnalyticsMetric({
			id: 'guest-activations',
			label: m['AnalyticsOverviewPage.UserAnalyticsOverviewMetrics.guestActivations'](),
			metric: metrics.guestActivations
		}),
		createComparedAnalyticsMetric({
			id: 'reservations',
			label: m['AnalyticsOverviewPage.UserAnalyticsOverviewMetrics.reservations'](),
			metric: metrics.requestsGenerated
		}),
		createComparedAnalyticsMetric({
			id: 'confirmed',
			label: m['AnalyticsOverviewPage.UserAnalyticsOverviewMetrics.confirmed'](),
			metric: metrics.confirmedReservations
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
