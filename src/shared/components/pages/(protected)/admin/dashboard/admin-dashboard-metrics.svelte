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
	import type { AdminDashboardTotals } from '@/convex/pages/adminDashboard/types/adminDashboardTypes';
	import type { AnalyticsMetric } from '@/features/analytics/types/analyticsTypes';

	let { totals }: { totals: AdminDashboardTotals } = $props();

	const metrics = $derived<AnalyticsMetric[]>([
		createStaticAnalyticsMetric({
			id: 'users',
			label: m['AdminDashboardPage.AdminDashboardMetrics.users'](),
			metric: { value: totals.users },
			analyticsLabel: getPresenceAnalyticsLabel(totals.users)
		}),
		createStaticAnalyticsMetric({
			id: 'accommodations',
			label: m['AdminDashboardPage.AdminDashboardMetrics.accommodations'](),
			metric: { value: totals.accommodations },
			analyticsLabel: getPresenceAnalyticsLabel(totals.accommodations)
		}),
		createStaticAnalyticsMetric({
			id: 'hospitalities',
			label: m['AdminDashboardPage.AdminDashboardMetrics.hospitalities'](),
			metric: { value: totals.hospitalities },
			analyticsLabel: getPresenceAnalyticsLabel(totals.hospitalities)
		}),
		createStaticAnalyticsMetric({
			id: 'partnerships',
			label: m['AdminDashboardPage.AdminDashboardMetrics.partnerships'](),
			metric: { value: totals.partnerships },
			analyticsLabel: getPresenceAnalyticsLabel(totals.partnerships)
		}),
		createStaticAnalyticsMetric({
			id: 'guests',
			label: m['AdminDashboardPage.AdminDashboardMetrics.guests'](),
			metric: { value: totals.guests },
			analyticsLabel: getPresenceAnalyticsLabel(totals.guests)
		})
	]);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{m['AdminDashboardPage.AdminDashboardMetrics.cardTitle']()}</Card.Title>
		<Card.Description>
			{m['AdminDashboardPage.AdminDashboardMetrics.cardDescription']()}
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<AnalyticsMetrics {metrics} class="xl:grid-cols-5" />
	</Card.Content>
</Card.Root>
