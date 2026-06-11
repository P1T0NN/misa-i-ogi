<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AdminAnalyticsMetrics from '@/shared/components/pages/(protected)/admin/analytics/admin-analytics-metrics.svelte';
	import AdminAnalyticsTrendChart from '@/shared/components/pages/(protected)/admin/analytics/admin-analytics-trend-chart.svelte';
	import AdminAnalyticsTopEntities from '@/shared/components/pages/(protected)/admin/analytics/admin-analytics-top-entities.svelte';
	import AdminAnalyticsHeader from '@/shared/components/pages/(protected)/admin/analytics/admin-analytics-header.svelte';
	import AdminAnalyticsLoading from '@/shared/components/pages/(protected)/admin/analytics/loading/admin-analytics-loading.svelte';
	import AdminAnalyticsError from '@/shared/components/pages/(protected)/admin/analytics/error/admin-analytics-error.svelte';

	const analyticsQuery = useQuery(
		api.pages.adminAnalytics.queries.fetchAdminAnalyticsOverviewPage
			.fetchAdminAnalyticsOverviewPage,
		() => ({})
	);

	const isLoading = $derived(analyticsQuery.data === undefined && !analyticsQuery.error);
	const hasError = $derived(Boolean(analyticsQuery.error));
	const data = $derived(analyticsQuery.data);
</script>

<SvelteHead title="Admin analytics" />

<section class="flex w-full flex-col gap-6 p-4 md:p-6 lg:gap-8 lg:p-8">
	<AdminAnalyticsHeader />

	{#if isLoading}
		<AdminAnalyticsLoading />
	{:else if hasError}
		<AdminAnalyticsError />
	{:else if data}
		<AdminAnalyticsMetrics metrics={data.metrics} />

		<AdminAnalyticsTrendChart data={data.trend} />

		<div class="grid gap-6 xl:grid-cols-2">
			<AdminAnalyticsTopEntities
				title="Top accommodations"
				description="Accommodations generating the strongest guest access and reservation demand."
				entityLabel="Accommodation"
				primaryLabel="Scans"
				secondaryLabel="Activations"
				rows={data.topAccommodations}
			/>

			<AdminAnalyticsTopEntities
				title="Top hospitalities"
				description="Hospitalities converting discovery into reservation requests."
				entityLabel="Hospitality"
				primaryLabel="Views"
				secondaryLabel="Requests"
				rows={data.topHospitalities}
			/>
		</div>
	{/if}
</section>
