<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ReservationsHeader from '@/shared/components/pages/(protected)/reservations/reservations-header.svelte';
	import ReservationsTabs from '@/shared/components/pages/(protected)/reservations/reservations-tabs/reservations-tabs.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import ReservationsTabsLoading from '@/shared/components/pages/(protected)/reservations/loading/reservations-tabs-loading.svelte';
	import ReservationsEmpty from '@/shared/components/pages/(protected)/reservations/empty/reservations-empty.svelte';

	// TYPES
	import type {
		FetchReservationsSummaryResult,
		ReservationCounts
	} from '@/convex/tables/reservations/types/reservationsTypes.js';

	const hasOwnedHospitalities = $derived(authClass.currentUser?.hasHospitalities === true);

	const reservationsSummaryQuery = useQuery(
		api.tables.reservations.queries.fetchReservationsSummary.fetchReservationsSummary,
		() => (authClass.userLoading || !hasOwnedHospitalities ? 'skip' : {})
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
		authClass.userLoading ||
			(hasOwnedHospitalities &&
				reservationsSummaryQuery.data === undefined &&
				!reservationsSummaryQuery.error)
	);
	const hasError = $derived(Boolean(reservationsSummaryQuery.error));
	const pendingCount = $derived(counts.pending);
</script>

<SvelteHead
	title={m['ReservationsPage.SEO.title']()}
	description={m['ReservationsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<ReservationsHeader {pendingCount} />

	{#if isLoading}
		<ReservationsTabsLoading />
	{:else if !hasOwnedHospitalities}
		<ReservationsEmpty />
	{:else if hasError}
		<ErrorComponent
			variant="card"
			title={m['ReservationsPage.errorTitle']()}
			description={m['ReservationsPage.errorDescription']()}
			showRetry={false}
		/>
	{:else}
		<ReservationsTabs {hospitalityNames} {counts} {isLoading} {hasError} />
	{/if}
</section>
