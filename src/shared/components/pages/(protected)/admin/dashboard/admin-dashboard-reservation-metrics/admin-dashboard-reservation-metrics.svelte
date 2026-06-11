<script lang="ts">
	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// UTILS
	import { createStaticAnalyticsMetric } from '@/features/analytics/utils/createAnalyticsMetric';
	import { getPresenceAnalyticsLabel } from '@/features/analytics/utils/analyticsLabelUtils';

	// TYPES
	import type { ReservationStatus } from '@/convex/tables/reservations/types/reservationsTypes';
	import type { AnalyticsMetric } from '@/features/analytics/types/analyticsTypes';

	let { counts }: { counts: Record<ReservationStatus, number> } = $props();

	const metrics = $derived<AnalyticsMetric[]>([
		createStaticAnalyticsMetric({
			id: 'pending',
			label: 'Pending',
			metric: { value: counts.pending },
			analyticsLabel: getPresenceAnalyticsLabel(counts.pending)
		}),

		createStaticAnalyticsMetric({
			id: 'confirmed',
			label: 'Confirmed',
			metric: { value: counts.confirmed },
			analyticsLabel: getPresenceAnalyticsLabel(counts.confirmed)
		}),

		createStaticAnalyticsMetric({
			id: 'cancelled',
			label: 'Cancelled',
			metric: { value: counts.cancelled },
			analyticsLabel: getPresenceAnalyticsLabel(counts.cancelled)
		}),

		createStaticAnalyticsMetric({
			id: 'no_show',
			label: 'No-show',
			metric: { value: counts.no_show },
			analyticsLabel: getPresenceAnalyticsLabel(counts.no_show)
		})
	]);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Reservation workload</Card.Title>
		<Card.Description>Current reservation outcomes across the whole platform.</Card.Description>
	</Card.Header>

	<Card.Content>
		<AnalyticsMetrics {metrics} />
	</Card.Content>
</Card.Root>
