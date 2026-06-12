<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AdminAnalyticsMetrics from '@/shared/components/pages/(protected)/admin/analytics/admin-analytics-metrics.svelte';
	import AdminAnalyticsTrendChart from '@/shared/components/pages/(protected)/admin/analytics/admin-analytics-trend-chart.svelte';
	import AnalyticsTopAccommodationsTable from '@/features/analytics/components/analytics-top-accommodations-table.svelte';
	import AnalyticsTopHospitalitiesTable from '@/features/analytics/components/analytics-top-hospitalities-table.svelte';
	import AdminAnalyticsHeader from '@/shared/components/pages/(protected)/admin/analytics/admin-analytics-header.svelte';
	import AdminAnalyticsLoading from '@/shared/components/pages/(protected)/admin/analytics/loading/admin-analytics-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';

	const analyticsQuery = useQuery(
		api.pages.adminAnalytics.queries.fetchAdminAnalyticsOverviewPage
			.fetchAdminAnalyticsOverviewPage,
		() => ({})
	);

	const isLoading = $derived(analyticsQuery.data === undefined && !analyticsQuery.error);
	const hasError = $derived(Boolean(analyticsQuery.error));
	const data = $derived(analyticsQuery.data);
</script>

<SvelteHead
	title={m['AdminAnalyticsPage.SEO.title']()}
	description={m['AdminAnalyticsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 p-4 md:p-6 lg:gap-8 lg:p-8">
	<AdminAnalyticsHeader />

	{#if isLoading}
		<AdminAnalyticsLoading />
	{:else if hasError}
		<ErrorComponent
			variant="panel"
			title={m['AdminAnalyticsPage.AdminAnalyticsError.title']()}
			headerDescription={m['AdminAnalyticsPage.AdminAnalyticsError.headerDescription']()}
			body={m['AdminAnalyticsPage.AdminAnalyticsError.body']()}
			bodyDescription={m['AdminAnalyticsPage.AdminAnalyticsError.bodyDescription']()}
		/>
	{:else if data}
		<AdminAnalyticsMetrics metrics={data.metrics} />

		<AdminAnalyticsTrendChart data={data.trend} />

		<div class="grid gap-6 xl:grid-cols-2">
			<AnalyticsTopAccommodationsTable rows={data.topAccommodations} variant="admin" />

			<AnalyticsTopHospitalitiesTable rows={data.topHospitalities} variant="admin" />
		</div>
	{/if}
</section>
