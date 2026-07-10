<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';

	// TYPES
	import type { UserAnalyticsHospitalityDetailMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsHospitalityDetailMetrics } = $props();

	const displayMetrics = $derived([
		createComparedAnalyticsMetric({
			id: 'guest-views',
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityMetrics.guestViews'](),
			metric: metrics.hospitalityViews
		}),
		createComparedAnalyticsMetric({
			id: 'requests-generated',
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityMetrics.reservations'](),
			metric: metrics.requestsGenerated
		}),
		createComparedAnalyticsMetric({
			id: 'confirmed',
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityMetrics.confirmed'](),
			metric: metrics.confirmedReservations
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} columns={3} />
