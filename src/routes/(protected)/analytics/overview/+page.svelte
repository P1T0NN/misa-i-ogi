<script lang="ts">
	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsOverviewQrScans from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-qr-scans.svelte';
	import UserAnalyticsOverviewGuestActivations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-guest-activations.svelte';
	import UserAnalyticsOverviewReservations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-reservations.svelte';
	import UserAnalyticsOverviewTopAccommodations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-top-accommodations.svelte';
	import UserAnalyticsOverviewTopHospitalities from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-top-hospitalities.svelte';
	import UserAnalyticsOverviewLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/loading/user-analytics-overview-loading.svelte';
	import UserAnalyticsOverviewEmpty from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/empty/user-analytics-overview-empty.svelte';
	import UserAnalyticsOverviewError from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/error/user-analytics-overview-error.svelte';

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

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow="Analytics overview"
		title="Owner analytics"
		description="A practical snapshot of guest activity, reservation demand, and places that need attention."
	/>

	{#if isLoading}
		<UserAnalyticsOverviewLoading />
	{:else if !hasOwnedPortfolio}
		<UserAnalyticsOverviewEmpty />
	{:else if hasError}
		<UserAnalyticsOverviewError />
	{:else if pageData}
		<UserAnalyticsOverviewQrScans data={pageData.qrScansChart} />

		<UserAnalyticsOverviewGuestActivations data={pageData.guestActivationsChart} />

		<UserAnalyticsOverviewReservations data={pageData.reservationsChart} />

		<UserAnalyticsOverviewTopAccommodations rows={pageData.topAccommodations} />

		<UserAnalyticsOverviewTopHospitalities rows={pageData.topHospitalities} />
	{/if}
</section>
