<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';
	import { labelAccommodationType } from '@/features/accommodations/data/accommodationsData';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/components/ui/breadcrumb/breadcrumbClass.svelte.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import AnalyticsTopHospitalitiesTable from '@/features/analytics/components/analytics-top-hospitalities-table.svelte';
	import UserAnalyticsAccommodationMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/[id]/user-analytics-accommodation-metrics.svelte';
	import UserAnalyticsAccommodationChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/[id]/user-analytics-accommodation-chart.svelte';
	import UserAnalyticsAccommodationsLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-accommodations/loading/user-analytics-accommodations-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	const id = $derived(page.params.id as Id<'accommodations'>);

	const detailQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsAccommodationPage
			.fetchUserAnalyticsAccommodationPage,
		() => ({ accommodationId: id })
	);

	const isLoading = $derived(detailQuery.data === undefined && !detailQuery.error);
	const hasError = $derived(Boolean(detailQuery.error));
	const data = $derived(detailQuery.data);

	$effect(() => {
		breadcrumbLabel.set(data?.accommodation.name);
		return () => breadcrumbLabel.reset();
	});
</script>

<SvelteHead
	title={data?.accommodation.name ?? m['AnalyticsAccommodationDetailPage.SEO.title']()}
	description={m['AnalyticsAccommodationDetailPage.SEO.description']()}
/>

{#if isLoading}
	<UserAnalyticsAccommodationsLoading />
{:else if hasError}
	<ErrorComponent
		variant="card"
		title={m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.title']()}
		headerDescription={m[
			'AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.headerDescription'
		]()}
		body={m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.body']()}
		showRetry={false}
	/>
{:else if data}
	<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
		<AnalyticsHeader
			eyebrow={m['AnalyticsAccommodationDetailPage.AnalyticsHeader.eyebrow']()}
			title={data.accommodation.name}
			description={m['AnalyticsAccommodationDetailPage.AnalyticsHeader.description']()}
			badge={labelAccommodationType(data.accommodation.type)}
		/>

		<UserAnalyticsAccommodationMetrics metrics={data.metrics} />

		<UserAnalyticsAccommodationChart data={data.activityData} />

		<AnalyticsTopHospitalitiesTable rows={data.performance.rows} variant="detailPerformance" />
	</section>
{/if}
