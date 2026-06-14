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
	import type { UserAnalyticsHospitalitiesPageMetrics } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { metrics }: { metrics: UserAnalyticsHospitalitiesPageMetrics } = $props();

	const displayMetrics = $derived([
		createStaticAnalyticsMetric({
			id: 'tracked-venues',
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityMetrics.trackedVenues'](),
			metric: metrics.trackedVenues,
			analyticsLabel: getPresenceAnalyticsLabel(metrics.trackedVenues.value)
		}),
		createComparedAnalyticsMetric({
			id: 'guest-views',
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityMetrics.guestViews'](),
			metric: metrics.hospitalityViews
		}),
		createComparedAnalyticsMetric({
			id: 'requests-generated',
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityMetrics.reservations'](),
			metric: metrics.requestsGenerated
		})
	]);
</script>

<AnalyticsMetrics metrics={displayMetrics} />
