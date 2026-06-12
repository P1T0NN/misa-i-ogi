<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

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
			label: m['AdminAnalyticsPage.AdminAnalyticsMetrics.qrScans'](),
			metric: { value: metrics.qrScans.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.qrScans.value)
		}),
		createStaticAnalyticsMetric({
			id: 'guestActivations',
			label: m['AdminAnalyticsPage.AdminAnalyticsMetrics.guestActivations'](),
			metric: { value: metrics.guestActivations.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.guestActivations.value)
		}),
		createStaticAnalyticsMetric({
			id: 'hospitalityViews',
			label: m['AdminAnalyticsPage.AdminAnalyticsMetrics.hospitalityViews'](),
			metric: { value: metrics.hospitalityViews.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.hospitalityViews.value)
		}),
		createStaticAnalyticsMetric({
			id: 'newReservations',
			label: m['AdminAnalyticsPage.AdminAnalyticsMetrics.newReservations'](),
			metric: { value: metrics.newReservations.value },
			analyticsLabel: getPresenceAnalyticsLabel(metrics.newReservations.value)
		}),
		{
			id: 'cancelledReservations',
			label: m['AdminAnalyticsPage.AdminAnalyticsMetrics.cancelledReservations'](),
			value: `${formatAnalyticsCount(metrics.cancelledReservations.conversion?.ratePercent ?? 0)}%`,
			analyticsLabel: getPresenceAnalyticsLabel(metrics.cancelledReservations.value)
		}
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} class="xl:grid-cols-5" />
