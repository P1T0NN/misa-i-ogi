<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';

	// TYPES
	import type { UserAnalyticsAccommodationsPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsAccommodationsPageMetrics } = $props();

	const displayMetrics = $derived([
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
		}),
		createComparedAnalyticsMetric({
			id: 'confirmed',
			label: m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsMetrics.confirmed'](),
			metric: metrics.confirmedReservations
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
