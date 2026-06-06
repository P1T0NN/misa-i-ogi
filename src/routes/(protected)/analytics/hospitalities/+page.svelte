<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsHospitalitiesChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/user-analytics-hospitalities-chart.svelte';
	import UserAnalyticsHospitalitiesMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/user-analytics-hospitalities-metrics.svelte';
	import UserAnalyticsHospitalitiesTable from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/user-analytics-hospitalities-table.svelte';
	import UserAnalyticsHospitalitiesLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/user-analytics-hospitalities-loading.svelte';
	import UserAnalyticsHospitalitiesError from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/user-analytics-hospitalities-error.svelte';

	const hospitalitiesPageQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsHospitalitiesPage
			.fetchUserAnalyticsHospitalitiesPage,
		() => ({})
	);

	const isLoading = $derived(
		hospitalitiesPageQuery.data === undefined && !hospitalitiesPageQuery.error
	);
	const hasError = $derived(Boolean(hospitalitiesPageQuery.error));
	const pageData = $derived(hospitalitiesPageQuery.data);
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow="Hospitality analytics"
		title="Venue demand from connected guests"
		description="Track which restaurants, cafes, tours, and wellness partners guests actually open and request."
		badge="Hospitality owners"
	/>

	{#if isLoading}
		<UserAnalyticsHospitalitiesLoading />
	{:else if hasError}
		<UserAnalyticsHospitalitiesError />
	{:else if pageData}
		<UserAnalyticsHospitalitiesMetrics metrics={pageData.metrics} />

		<UserAnalyticsHospitalitiesChart data={pageData.chart.data} />

		<UserAnalyticsHospitalitiesTable rows={pageData.rows} />
	{/if}
</section>
