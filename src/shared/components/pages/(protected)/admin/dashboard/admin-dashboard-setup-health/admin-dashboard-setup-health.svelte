<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

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
			label: m['AdminDashboardPage.AdminDashboardSetupHealth.inactiveAccommodations'](),
			metric: { value: health.inactiveAccommodations },
			analyticsLabel: getPresenceAnalyticsLabel(health.inactiveAccommodations)
		}),
		createStaticAnalyticsMetric({
			id: 'inactiveHospitalities',
			label: m['AdminDashboardPage.AdminDashboardSetupHealth.inactiveHospitalities'](),
			metric: { value: health.inactiveHospitalities },
			analyticsLabel: getPresenceAnalyticsLabel(health.inactiveHospitalities)
		}),
		createStaticAnalyticsMetric({
			id: 'unlinkedAccommodations',
			label: m['AdminDashboardPage.AdminDashboardSetupHealth.unlinkedAccommodations'](),
			metric: { value: health.unlinkedAccommodations },
			analyticsLabel: getPresenceAnalyticsLabel(health.unlinkedAccommodations)
		}),
		createStaticAnalyticsMetric({
			id: 'unlinkedHospitalities',
			label: m['AdminDashboardPage.AdminDashboardSetupHealth.unlinkedHospitalities'](),
			metric: { value: health.unlinkedHospitalities },
			analyticsLabel: getPresenceAnalyticsLabel(health.unlinkedHospitalities)
		}),
		createStaticAnalyticsMetric({
			id: 'pendingReservations',
			label: m['AdminDashboardPage.AdminDashboardSetupHealth.pendingReservations'](),
			metric: { value: health.pendingReservations },
			analyticsLabel: getPresenceAnalyticsLabel(health.pendingReservations)
		})
	]);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{m['AdminDashboardPage.AdminDashboardSetupHealth.cardTitle']()}</Card.Title>
		<Card.Description>
			{m['AdminDashboardPage.AdminDashboardSetupHealth.cardDescription']()}
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<AnalyticsMetrics {metrics} />
	</Card.Content>
</Card.Root>
