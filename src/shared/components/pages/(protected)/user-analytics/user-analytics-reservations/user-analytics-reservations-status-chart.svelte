<script lang="ts">
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

	const chartConfig = {
		created: {
			label: 'Created',
			color: 'var(--chart-1)'
		},
		confirmed: {
			label: 'Confirmed',
			color: 'var(--chart-2)'
		},
		cancelled: {
			label: 'Cancelled',
			color: 'var(--chart-5)'
		}
	} satisfies ChartConfig;
</script>

{#if !hasStatusData}
	<UserAnalyticsReservationsStatusChartEmpty />
{:else}
	<AreaChartInteractive
		data={chartData}
		x="date"
		config={chartConfig}
		timeRange="30d"
		title="Reservation trend"
		description="Daily reservation outcomes across connected places."
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-80 w-full"
		tooltipIndicator="dot"
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
	/>
{/if}
