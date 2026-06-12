<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsAccommodationsChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/user-analytics-accommodations-chart.svelte';
	import UserAnalyticsAccommodationsMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/user-analytics-accommodations-metrics.svelte';
	import AnalyticsTopAccommodationsTable from '@/features/analytics/components/analytics-top-accommodations-table.svelte';
	import UserAnalyticsAccommodationsLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/loading/user-analytics-accommodations-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import UserAnalyticsAccommodationsEmpty from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/empty/user-analytics-accommodations-empty.svelte';

	const hasOwnedAccommodations = $derived(authClass.currentUser?.hasAccommodations === true);

	const accommodationsPageQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsAccommodationsPage
			.fetchUserAnalyticsAccommodationsPage,
		() => (authClass.userLoading || !hasOwnedAccommodations ? 'skip' : {})
	);

	const isPageLoading = $derived(
		accommodationsPageQuery.data === undefined && !accommodationsPageQuery.error
	);
	const isLoading = $derived(authClass.userLoading || (hasOwnedAccommodations && isPageLoading));
	const hasError = $derived(Boolean(accommodationsPageQuery.error));
	const pageData = $derived(accommodationsPageQuery.data);
</script>

<SvelteHead
	title={m['AnalyticsAccommodationsPage.SEO.title']()}
	description={m['AnalyticsAccommodationsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow={m['AnalyticsAccommodationsPage.AnalyticsHeader.eyebrow']()}
		title={m['AnalyticsAccommodationsPage.AnalyticsHeader.title']()}
		description={m['AnalyticsAccommodationsPage.AnalyticsHeader.description']()}
	/>

	{#if isLoading}
		<UserAnalyticsAccommodationsLoading />
	{:else if !hasOwnedAccommodations}
		<UserAnalyticsAccommodationsEmpty />
	{:else if hasError}
		<ErrorComponent
			variant="card"
			title={m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.title']()}
			headerDescription={m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.headerDescription']()}
			body={m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.body']()}
			showRetry={false}
		/>
	{:else if pageData}
		<UserAnalyticsAccommodationsMetrics metrics={pageData.metrics} />

		<UserAnalyticsAccommodationsChart data={pageData.chart.data} />

		<AnalyticsTopAccommodationsTable rows={pageData.rows} variant="performance" />
	{/if}
</section>
