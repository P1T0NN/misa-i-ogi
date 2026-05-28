<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ReservationsHeader from '@/shared/components/pages/(protected)/reservations/reservations-header.svelte';
	import ReservationsTabs from '@/shared/components/pages/(protected)/reservations/reservations-tabs/reservations-tabs.svelte';

	// TYPES
	import type {
		FetchReservationsSummaryResult,
		ReservationCounts
	} from '@/convex/tables/reservations/types/reservationsTypes.js';

	const reservationsSummaryQuery = useQuery(
		api.tables.reservations.queries.fetchReservationsSummary.fetchReservationsSummary,
		() => ({})
	);

	const emptyCounts: ReservationCounts = {
		pending: 0,
		confirmed: 0,
		cancelled: 0,
		no_show: 0
	};

	const reservationsSummary = $derived(
		reservationsSummaryQuery.data as FetchReservationsSummaryResult | undefined
	);
	const hospitalityNames = $derived(reservationsSummary?.hospitalityNames ?? []);
	const counts = $derived(reservationsSummary?.counts ?? emptyCounts);
	const isLoading = $derived(
		reservationsSummaryQuery.data === undefined && !reservationsSummaryQuery.error
	);
	const hasError = $derived(Boolean(reservationsSummaryQuery.error));
	const pendingCount = $derived(counts.pending);
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<ReservationsHeader {pendingCount} />

	<ReservationsTabs {hospitalityNames} {counts} {isLoading} {hasError} />
</section>
