<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsHospitalitiesChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/user-analytics-hospitalities-chart.svelte';
	import UserAnalyticsHospitalitiesMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/user-analytics-hospitalities-metrics.svelte';
	import AnalyticsTopHospitalitiesTable from '@/features/analytics/components/analytics-top-hospitalities-table.svelte';
	import UserAnalyticsHospitalitiesLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/loading/user-analytics-hospitalities-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import UserAnalyticsHospitalitiesEmpty from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/empty/user-analytics-hospitalities-empty.svelte';

	const hasOwnedHospitalities = $derived(authClass.currentUser?.hasHospitalities === true);

	const hospitalitiesPageQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsHospitalitiesPage
			.fetchUserAnalyticsHospitalitiesPage,
		() => (authClass.userLoading || !hasOwnedHospitalities ? 'skip' : {})
	);

	const isPageLoading = $derived(
		hospitalitiesPageQuery.data === undefined && !hospitalitiesPageQuery.error
	);
	const isLoading = $derived(authClass.userLoading || (hasOwnedHospitalities && isPageLoading));
	const hasError = $derived(Boolean(hospitalitiesPageQuery.error));
	const pageData = $derived(hospitalitiesPageQuery.data);
</script>

<SvelteHead
	title={m['AnalyticsHospitalitiesPage.SEO.title']()}
	description={m['AnalyticsHospitalitiesPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow={m['AnalyticsHospitalitiesPage.AnalyticsHeader.eyebrow']()}
		title={m['AnalyticsHospitalitiesPage.AnalyticsHeader.title']()}
		description={m['AnalyticsHospitalitiesPage.AnalyticsHeader.description']()}
	/>

	{#if isLoading}
		<UserAnalyticsHospitalitiesLoading />
	{:else if !hasOwnedHospitalities}
		<UserAnalyticsHospitalitiesEmpty />
	{:else if hasError}
		<ErrorComponent
			variant="card"
			title={m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.title']()}
			headerDescription={m[
				'AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.headerDescription'
			]()}
			body={m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.body']()}
			showRetry={false}
		/>
	{:else if pageData}
		<UserAnalyticsHospitalitiesMetrics metrics={pageData.metrics} />

		<UserAnalyticsHospitalitiesChart data={pageData.chart.data} />

		<AnalyticsTopHospitalitiesTable rows={pageData.rows} variant="performance" />
	{/if}
</section>
