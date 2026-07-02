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
	import UserAnalyticsReservationsMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/user-analytics-reservations-metrics.svelte';
	import UserAnalyticsReservationsStatusChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/user-analytics-reservations-status-chart.svelte';
	import UserAnalyticsReservationsTable from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/user-analytics-reservations-table.svelte';
	import UserAnalyticsReservationsLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/loading/user-analytics-reservations-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import UserAnalyticsReservationsEmpty from '@/shared/components/pages/(protected)/user-analytics/user-analytics-reservations/empty/user-analytics-reservations-empty.svelte';

	const hasOwnedHospitalities = $derived(authClass.currentUser?.hasHospitalities === true);

	const reservationsPageQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsReservationsPage
			.fetchUserAnalyticsReservationsPage,
		() => (authClass.userLoading || !hasOwnedHospitalities ? 'skip' : {})
	);

	const isPageLoading = $derived(
		reservationsPageQuery.data === undefined && !reservationsPageQuery.error
	);
	const isLoading = $derived(authClass.userLoading || (hasOwnedHospitalities && isPageLoading));
	const hasError = $derived(Boolean(reservationsPageQuery.error));
	const pageData = $derived(reservationsPageQuery.data);
</script>

<SvelteHead
	title={m['AnalyticsReservationsPage.SEO.title']()}
	description={m['AnalyticsReservationsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow={m['AnalyticsReservationsPage.AnalyticsHeader.eyebrow']()}
		title={m['AnalyticsReservationsPage.AnalyticsHeader.title']()}
		description={m['AnalyticsReservationsPage.AnalyticsHeader.description']()}
	/>

	{#if isLoading}
		<UserAnalyticsReservationsLoading />
	{:else if !hasOwnedHospitalities}
		<UserAnalyticsReservationsEmpty />
	{:else if hasError}
		<ErrorComponent
			variant="card"
			title={m['AnalyticsReservationsPage.UserAnalyticsReservationsError.title']()}
			headerDescription={m[
				'AnalyticsReservationsPage.UserAnalyticsReservationsError.headerDescription'
			]()}
			body={m['AnalyticsReservationsPage.UserAnalyticsReservationsError.body']()}
			showRetry={false}
		/>
	{:else if pageData}
		<UserAnalyticsReservationsMetrics metrics={pageData.metrics} />

		<UserAnalyticsReservationsStatusChart data={pageData.statusChart.data} />

		<UserAnalyticsReservationsTable rows={pageData.rows} />
	{/if}
</section>
