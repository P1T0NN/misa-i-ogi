<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';

	// TYPES
	import type { UserAnalyticsHospitalitiesPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsHospitalitiesPageMetrics } = $props();

	const displayMetrics = $derived([
		createComparedAnalyticsMetric({
			id: 'guest-views',
			label: m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesMetrics.guestViews'](),
			metric: metrics.hospitalityViews
		}),
		createComparedAnalyticsMetric({
			id: 'guest-activations',
			label: m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesMetrics.guestActivations'](),
			metric: metrics.guestActivations
		}),
		createComparedAnalyticsMetric({
			id: 'requests-generated',
			label: m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesMetrics.reservations'](),
			metric: metrics.requestsGenerated
		}),
		createComparedAnalyticsMetric({
			id: 'confirmed',
			label: m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesMetrics.confirmed'](),
			metric: metrics.confirmedReservations
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
