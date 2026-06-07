<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsReservationsMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/user-analytics-reservations-metrics.svelte';
	import UserAnalyticsReservationsStatusChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/user-analytics-reservations-status-chart.svelte';
	import UserAnalyticsReservationsTable from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/user-analytics-reservations-table.svelte';
	import UserAnalyticsReservationsLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/loading/user-analytics-reservations-loading.svelte';
	import UserAnalyticsReservationsError from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/error/user-analytics-reservations-error.svelte';

	const reservationsPageQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsReservationsPage
			.fetchUserAnalyticsReservationsPage,
		() => ({})
	);

	const isLoading = $derived(
		reservationsPageQuery.data === undefined && !reservationsPageQuery.error
	);
	const hasError = $derived(Boolean(reservationsPageQuery.error));
	const pageData = $derived(reservationsPageQuery.data);
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow="Reservation analytics"
		title="Reservation flow"
		description="Understand request volume, confirmation health, and cancellation patterns."
		badge="Operations"
	/>

	{#if isLoading}
		<UserAnalyticsReservationsLoading />
	{:else if hasError}
		<UserAnalyticsReservationsError />
	{:else if pageData}
		<UserAnalyticsReservationsMetrics metrics={pageData.metrics} />

		<UserAnalyticsReservationsStatusChart data={pageData.statusChart.data} />

		<UserAnalyticsReservationsTable rows={pageData.rows} />
	{/if}
</section>
