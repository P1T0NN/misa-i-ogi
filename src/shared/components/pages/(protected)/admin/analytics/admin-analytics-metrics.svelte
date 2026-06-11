<script lang="ts">
	// COMPONENTS
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { formatAnalyticsCount } from '@/features/analytics/utils/analyticsDisplayFormattersUtils';
	import { createStaticAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';
	import { getPresenceAnalyticsLabel } from '@/features/analytics/utils/analyticsLabelUtils';

	// TYPES
	import type { AdminAnalyticsDashboardMetrics } from '@/convex/pages/adminAnalytics/types/adminAnalyticsTypes';
	import type { AnalyticsMetric } from '@/features/analytics/types/analyticsTypes';

	let { metrics }: { metrics: AdminAnalyticsDashboardMetrics } = $props();

	const displayMetrics = $derived<AnalyticsMetric[]>([
		createStaticAnalyticsMetric({
			id: 'qrScans',
			label: 'QR scans',
			metric: { value: metrics.qrScans.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.qrScans.value)
		}),
		createStaticAnalyticsMetric({
			id: 'guestActivations',
			label: 'Guest activations',
			metric: { value: metrics.guestActivations.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.guestActivations.value)
		}),
		createStaticAnalyticsMetric({
			id: 'hospitalityViews',
			label: 'Hospitality views',
			metric: { value: metrics.hospitalityViews.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.hospitalityViews.value)
		}),
		createStaticAnalyticsMetric({
			id: 'newReservations',
			label: 'Reservation requests',
			metric: { value: metrics.newReservations.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.newReservations.value)
		}),
		{
			id: 'cancelledReservations',
			label: 'Cancellation rate',
			value: `${formatAnalyticsCount(metrics.cancelledReservations.conversion?.ratePercent ?? 0)}%`,
			analyticsLabel: getPresenceAnalyticsLabel(metrics.cancelledReservations.value)
		}
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} class="xl:grid-cols-5" />
