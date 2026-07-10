<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createComparedAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';

	// TYPES
	import type { UserAnalyticsReservationsPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type { AnalyticsMetric } from '@/features/analytics/types/analyticsTypes';

	let { metrics }: { metrics: UserAnalyticsReservationsPageMetrics } = $props();

	const displayMetrics = $derived<AnalyticsMetric[]>([
		createComparedAnalyticsMetric({
			id: 'created',
			label: m['AnalyticsReservationsPage.UserAnalyticsReservationsMetrics.created'](),
			metric: metrics.created
		}),
		createComparedAnalyticsMetric({
			id: 'confirmed',
			label: m['AnalyticsReservationsPage.UserAnalyticsReservationsMetrics.confirmed'](),
			metric: metrics.confirmed
		}),
		createComparedAnalyticsMetric({
			id: 'cancelled',
			label: m['AnalyticsReservationsPage.UserAnalyticsReservationsMetrics.cancelled'](),
			metric: metrics.cancelled
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} columns={3} />
