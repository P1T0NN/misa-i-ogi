<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/components/ui/breadcrumb/breadcrumbClass.svelte.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import AnalyticsTopAccommodationsTable from '@/features/analytics/components/analytics-top-accommodations-table.svelte';
	import UserAnalyticsHospitalityMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/[id]/user-analytics-hospitality-metrics.svelte';
	import UserAnalyticsHospitalityChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/[id]/user-analytics-hospitality-chart.svelte';
	import UserAnalyticsHospitalitiesLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/loading/user-analytics-hospitalities-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	const id = $derived(page.params.id as Id<'hospitalities'>);

	const detailQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsHospitalityPage
			.fetchUserAnalyticsHospitalityPage,
		() => ({ hospitalityId: id })
	);

	const isLoading = $derived(detailQuery.data === undefined && !detailQuery.error);
	const hasError = $derived(Boolean(detailQuery.error));
	const data = $derived(detailQuery.data);

	$effect(() => {
		breadcrumbLabel.set(data?.hospitality.name);
		return () => breadcrumbLabel.reset();
	});
</script>

<SvelteHead
	title={data?.hospitality.name ?? m['AnalyticsHospitalityDetailPage.SEO.title']()}
	description={m['AnalyticsHospitalityDetailPage.SEO.description']()}
/>

{#if isLoading}
	<UserAnalyticsHospitalitiesLoading />
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
{:else if data}
	<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
		<AnalyticsHeader
			eyebrow={m['AnalyticsHospitalityDetailPage.AnalyticsHeader.eyebrow']()}
			title={data.hospitality.name}
			description={m['AnalyticsHospitalityDetailPage.AnalyticsHeader.description']()}
			badge={labelHospitalityType(data.hospitality.type)}
		/>

		<UserAnalyticsHospitalityMetrics metrics={data.metrics} />

		<UserAnalyticsHospitalityChart data={data.activityData} />

		<AnalyticsTopAccommodationsTable rows={data.performance.rows} variant="detailPerformance" />
	</section>
{/if}
