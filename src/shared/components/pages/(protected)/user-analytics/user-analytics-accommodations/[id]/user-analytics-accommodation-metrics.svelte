<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';

	// TYPES
	import type { UserAnalyticsAccommodationDetailMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsAccommodationDetailMetrics } = $props();

	const displayMetrics = $derived([
		createComparedAnalyticsMetric({
			id: 'qr-scans',
			label: m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.qrScans'](),
			metric: metrics.qrScans
		}),
		createComparedAnalyticsMetric({
			id: 'guest-activations',
			label:
				m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.guestActivations'](),
			metric: metrics.guestActivations
		}),
		createComparedAnalyticsMetric({
			id: 'requests-generated',
			label: m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.reservations'](),
			metric: metrics.requestsGenerated
		}),
		createComparedAnalyticsMetric({
			id: 'confirmed',
			label: m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.confirmed'](),
			metric: metrics.confirmedReservations
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
