<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
	import AnalyticsMetrics from '@/features/analytics/components/analytics-metrics.svelte';

	// I18N
	import { reservationStatusLabel } from '@/features/reservations/i18n/reservationDisplay';

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
			label: reservationStatusLabel('pending'),
			metric: { value: counts.pending },
			analyticsLabel: getPresenceAnalyticsLabel(counts.pending)
		}),
		createStaticAnalyticsMetric({
			id: 'confirmed',
			label: reservationStatusLabel('confirmed'),
			metric: { value: counts.confirmed },
			analyticsLabel: getPresenceAnalyticsLabel(counts.confirmed)
		}),
		createStaticAnalyticsMetric({
			id: 'cancelled',
			label: reservationStatusLabel('cancelled'),
			metric: { value: counts.cancelled },
			analyticsLabel: getPresenceAnalyticsLabel(counts.cancelled)
		}),
		createStaticAnalyticsMetric({
			id: 'no_show',
			label: reservationStatusLabel('no_show'),
			metric: { value: counts.no_show },
			analyticsLabel: getPresenceAnalyticsLabel(counts.no_show)
		})
	]);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{m['AdminDashboardPage.AdminDashboardReservationMetrics.cardTitle']()}</Card.Title>
		<Card.Description>
			{m['AdminDashboardPage.AdminDashboardReservationMetrics.cardDescription']()}
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<AnalyticsMetrics {metrics} />
	</Card.Content>
</Card.Root>
