<script lang="ts">
	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createStaticAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';
	import { getPresenceAnalyticsLabel } from '@/features/analytics/utils/analyticsLabelUtils';

	// TYPES
	import type { AdminDashboardSetupHealthCounts } from '@/convex/pages/adminDashboard/types/adminDashboardTypes';
	import type { AnalyticsMetric } from '@/features/analytics/types/analyticsTypes';

	let { health }: { health: AdminDashboardSetupHealthCounts } = $props();

	const metrics = $derived<AnalyticsMetric[]>([
		createStaticAnalyticsMetric({
			id: 'inactiveAccommodations',
			label: 'Inactive accommodations',
			metric: { value: health.inactiveAccommodations },
			analyticsLabel: getPresenceAnalyticsLabel(health.inactiveAccommodations)
		}),
		createStaticAnalyticsMetric({
			id: 'inactiveHospitalities',
			label: 'Inactive hospitalities',
			metric: { value: health.inactiveHospitalities },
			analyticsLabel: getPresenceAnalyticsLabel(health.inactiveHospitalities)
		}),
		createStaticAnalyticsMetric({
			id: 'unlinkedAccommodations',
			label: 'Accommodations without links',
			metric: { value: health.unlinkedAccommodations },
			analyticsLabel: getPresenceAnalyticsLabel(health.unlinkedAccommodations)
		}),
		createStaticAnalyticsMetric({
			id: 'unlinkedHospitalities',
			label: 'Hospitalities without links',
			metric: { value: health.unlinkedHospitalities },
			analyticsLabel: getPresenceAnalyticsLabel(health.unlinkedHospitalities)
		}),
		createStaticAnalyticsMetric({
			id: 'pendingReservations',
			label: 'Pending reservations',
			metric: { value: health.pendingReservations },
			analyticsLabel: getPresenceAnalyticsLabel(health.pendingReservations)
		})
	]);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Setup health</Card.Title>
		<Card.Description
			>Operational gaps that can keep guests from discovering hospitalities.</Card.Description
		>
	</Card.Header>

	<Card.Content>
		<AnalyticsMetrics {metrics} />
	</Card.Content>
</Card.Root>
