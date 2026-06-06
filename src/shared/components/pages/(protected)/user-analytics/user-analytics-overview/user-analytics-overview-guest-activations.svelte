<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';
	import UserAnalyticsOverviewGuestActivationsLoading from './loading/user-analytics-overview-guest-activations-loading.svelte';
	import UserAnalyticsOverviewGuestActivationsError from './error/user-analytics-overview-guest-activations-error.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsChartPoint } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	const guestActivationsQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsGuestActivationsChart
			.fetchUserAnalyticsGuestActivationsChart,
		() => ({})
	);

	const isLoading = $derived(
		guestActivationsQuery.data === undefined && !guestActivationsQuery.error
	);
	const hasError = $derived(Boolean(guestActivationsQuery.error));

	const chartConfig = {
		guestActivations: {
			label: 'Guest activations',
			color: 'var(--success)'
		}
	} satisfies ChartConfig;

	const chartData = $derived(
		guestActivationsQuery.data?.map((p: UserAnalyticsChartPoint) => ({
			date: new Date(p.date),
			guestActivations: p.value
		})) ?? []
	);
</script>

{#if isLoading}
	<UserAnalyticsOverviewGuestActivationsLoading />
{:else if hasError}
	<UserAnalyticsOverviewGuestActivationsError />
{:else}
	<AreaChartInteractive
		data={chartData}
		x="date"
		config={chartConfig}
		timeRange="30d"
		title="Guest activations"
		description="Guest sessions activated over time."
		cardClass="py-0"
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-72 w-full"
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
		tooltipIndicator="dot"
	/>
{/if}
