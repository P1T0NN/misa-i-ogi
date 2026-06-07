<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsHospitalityMetrics from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/[id]/user-analytics-hospitality-metrics.svelte';
	import UserAnalyticsHospitalityChart from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/[id]/user-analytics-hospitality-chart.svelte';
	import UserAnalyticsHospitalityPerformanceTable from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/[id]/user-analytics-hospitality-performance-table.svelte';
	import UserAnalyticsHospitalitiesLoading from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/loading/user-analytics-hospitalities-loading.svelte';
	import UserAnalyticsHospitalitiesError from '@/shared/components/pages/(protected)/user-analytics/user-analytics-hospitalities/error/user-analytics-hospitalities-error.svelte';

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
</script>

<SvelteHead />

{#if isLoading}
	<UserAnalyticsHospitalitiesLoading />
{:else if hasError}
	<UserAnalyticsHospitalitiesError />
{:else if data}
	<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
		<AnalyticsHeader
			eyebrow="Hospitality analytics"
			title={data.hospitality.name}
			description="Guest demand, reservation flow, and source stays for this hospitality."
			badge={labelHospitalityType(data.hospitality.type)}
		/>

		<UserAnalyticsHospitalityMetrics metrics={data.metrics} />

		<UserAnalyticsHospitalityChart data={data.activityData} />

		<UserAnalyticsHospitalityPerformanceTable rows={data.performance.rows} />
	</section>
{/if}
