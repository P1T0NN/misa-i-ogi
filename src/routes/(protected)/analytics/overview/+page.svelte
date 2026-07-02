<script lang="ts">
	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsOverviewQrScans from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-qr-scans.svelte';
	import UserAnalyticsOverviewGuestActivations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-guest-activations.svelte';
	import UserAnalyticsOverviewReservations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-reservations.svelte';
	import AnalyticsTopAccommodationsTable from '@/features/analytics/components/analytics-top-accommodations-table.svelte';
	import AnalyticsTopHospitalitiesTable from '@/features/analytics/components/analytics-top-hospitalities-table.svelte';
	import UserAnalyticsOverviewLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/loading/user-analytics-overview-loading.svelte';
	import UserAnalyticsOverviewEmpty from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/empty/user-analytics-overview-empty.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';

	// One `useQuery` for the whole overview (see `fetchUserAnalyticsOverviewPage` comment)
	// instead of five widget-level subscriptions — fewer Convex watchers per active owner.
	const hasOwnedPortfolio = $derived(
		authClass.currentUser?.hasAccommodations === true ||
			authClass.currentUser?.hasHospitalities === true
	);

	const overviewPageQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsOverviewPage.fetchUserAnalyticsOverviewPage,
		() => (authClass.userLoading || !hasOwnedPortfolio ? 'skip' : {})
	);

	const isPageLoading = $derived(overviewPageQuery.data === undefined && !overviewPageQuery.error);
	const isLoading = $derived(authClass.userLoading || (hasOwnedPortfolio && isPageLoading));
	const hasError = $derived(Boolean(overviewPageQuery.error));
	const pageData = $derived(overviewPageQuery.data);
</script>

<SvelteHead
	title={m['AnalyticsOverviewPage.SEO.title']()}
	description={m['AnalyticsOverviewPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow={m['AnalyticsOverviewPage.AnalyticsHeader.eyebrow']()}
		title={m['AnalyticsOverviewPage.AnalyticsHeader.title']()}
		description={m['AnalyticsOverviewPage.AnalyticsHeader.description']()}
	/>

	{#if isLoading}
		<UserAnalyticsOverviewLoading />
	{:else if !hasOwnedPortfolio}
		<UserAnalyticsOverviewEmpty />
	{:else if hasError}
		<ErrorComponent
			variant="card"
			title={m['AnalyticsOverviewPage.UserAnalyticsOverviewError.title']()}
			headerDescription={m['AnalyticsOverviewPage.UserAnalyticsOverviewError.headerDescription']()}
			body={m['AnalyticsOverviewPage.UserAnalyticsOverviewError.body']()}
			showRetry={false}
		/>
	{:else if pageData}
		<UserAnalyticsOverviewQrScans data={pageData.qrScansChart} />

		<UserAnalyticsOverviewGuestActivations data={pageData.guestActivationsChart} />

		<UserAnalyticsOverviewReservations data={pageData.reservationsChart} />

		<AnalyticsTopAccommodationsTable rows={pageData.topAccommodations} variant="top" />

		<AnalyticsTopHospitalitiesTable rows={pageData.topHospitalities} variant="top" />
	{/if}
</section>
