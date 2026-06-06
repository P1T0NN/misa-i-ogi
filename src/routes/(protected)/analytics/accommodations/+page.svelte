<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsAccommodationsChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/user-analytics-accommodations-chart.svelte';
	import UserAnalyticsAccommodationsMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/user-analytics-accommodations-metrics.svelte';
	import UserAnalyticsAccommodationsTable from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/user-analytics-accommodations-table.svelte';
	import UserAnalyticsAccommodationsLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/user-analytics-accommodations-loading.svelte';
	import UserAnalyticsAccommodationsError from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/user-analytics-accommodations-error.svelte';

	const accommodationsPageQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsAccommodationsPage
			.fetchUserAnalyticsAccommodationsPage,
		() => ({})
	);

	const isLoading = $derived(
		accommodationsPageQuery.data === undefined && !accommodationsPageQuery.error
	);
	const hasError = $derived(Boolean(accommodationsPageQuery.error));
	const pageData = $derived(accommodationsPageQuery.data);
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow="Accommodation analytics"
		title="Guest access by accommodation"
		description="Compare your stays by QR scan volume, guest activations, and reservation requests generated."
		badge="Accommodation owners"
	/>

	{#if isLoading}
		<UserAnalyticsAccommodationsLoading />
	{:else if hasError}
		<UserAnalyticsAccommodationsError />
	{:else if pageData}
		<UserAnalyticsAccommodationsMetrics metrics={pageData.metrics} />

		<UserAnalyticsAccommodationsChart data={pageData.chart.data} />

		<UserAnalyticsAccommodationsTable rows={pageData.rows} />
	{/if}
</section>
