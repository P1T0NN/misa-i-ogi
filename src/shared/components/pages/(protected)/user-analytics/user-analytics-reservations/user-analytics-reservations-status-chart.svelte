<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';
	import UserAnalyticsReservationsStatusChartEmpty from './empty/user-analytics-reservations-status-chart-empty.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsReservationStatusChartPoint } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { data }: { data: UserAnalyticsReservationStatusChartPoint[] } = $props();

	const hasStatusData = $derived(
		data.some((row) => row.created > 0 || row.confirmed > 0 || row.cancelled > 0)
	);
	const chartData = $derived(data.map((row) => ({ ...row, date: new Date(row.date) })));

	const chartConfig = $derived({
		created: {
			label: m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChart.created'](),
			color: 'var(--chart-1)'
		},
		confirmed: {
			label: m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChart.confirmed'](),
			color: 'var(--chart-2)'
		},
		cancelled: {
			label: m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChart.cancelled'](),
			color: 'var(--chart-5)'
		}
	} satisfies ChartConfig);
</script>

{#if !hasStatusData}
	<UserAnalyticsReservationsStatusChartEmpty />
{:else}
	<AreaChartInteractive
		data={chartData}
		x="date"
		config={chartConfig}
		timeRange="30d"
		title={m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChart.title']()}
		description={m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChart.description']()}
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-80 w-full"
		tooltipIndicator="dot"
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
	/>
{/if}
