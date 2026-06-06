<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';
	import UserAnalyticsOverviewReservationsLoading from './loading/user-analytics-overview-reservations-loading.svelte';
	import UserAnalyticsOverviewReservationsError from './error/user-analytics-overview-reservations-error.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsChartPoint } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	const reservationsQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsReservationsChart
			.fetchUserAnalyticsReservationsChart,
		() => ({})
	);

	const isLoading = $derived(reservationsQuery.data === undefined && !reservationsQuery.error);
	const hasError = $derived(Boolean(reservationsQuery.error));

	const chartConfig = {
		reservations: {
			label: 'Reservations',
			color: 'var(--chart-3)'
		}
	} satisfies ChartConfig;

	const chartData = $derived(
		reservationsQuery.data?.map((p: UserAnalyticsChartPoint) => ({
			date: new Date(p.date),
			reservations: p.value
		})) ?? []
	);
</script>

{#if isLoading}
	<UserAnalyticsOverviewReservationsLoading />
{:else if hasError}
	<UserAnalyticsOverviewReservationsError />
{:else}
	<AreaChartInteractive
		data={chartData}
		x="date"
		config={chartConfig}
		timeRange="30d"
		title="Reservations"
		description="Reservation requests created across connected venues."
		cardClass="py-0"
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-72 w-full"
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
		tooltipIndicator="dot"
	/>
{/if}
