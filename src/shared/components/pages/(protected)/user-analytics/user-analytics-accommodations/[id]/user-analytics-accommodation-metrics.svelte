<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

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
			label: m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.trackedStays'](),
			metric: metrics.trackedStays,
			analyticsLabel: getPresenceAnalyticsLabel(metrics.trackedStays.value)
		}),
		createComparedAnalyticsMetric({
			id: 'qr-scans',
			label: m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.qrScans'](),
			metric: metrics.qrScans
		}),
		createComparedAnalyticsMetric({
			id: 'guest-activations',
			label: m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.guestActivations'](),
			metric: metrics.guestActivations
		}),
		createComparedAnalyticsMetric({
			id: 'requests-generated',
			label: m['AnalyticsAccommodationDetailPage.UserAnalyticsAccommodationMetrics.reservations'](),
			metric: metrics.requestsGenerated
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
