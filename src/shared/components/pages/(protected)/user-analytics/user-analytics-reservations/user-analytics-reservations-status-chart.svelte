<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { getLocale } from '@/shared/lib/paraglide/runtime';

	// COMPONENTS
	import LineChartInteractive from '@/shared/components/ui/custom-charts/line-chart-interactive.svelte';
	import UserAnalyticsReservationsStatusChartEmpty from './empty/user-analytics-reservations-status-chart-empty.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsReservationStatusChartPoint } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { data }: { data: UserAnalyticsReservationStatusChartPoint[] } = $props();

	const locale = $derived(getLocale());

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
			color: 'var(--success)'
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
	<LineChartInteractive
		data={chartData}
		x="date"
		config={chartConfig}
		title={m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChart.title']()}
		description={m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChart.description']()}
		cardClass="py-0"
		containerClass="aspect-auto h-80 w-full"
		tooltipIndicator="dot"
		yAxisFormat={(value) => Number(value).toLocaleString(locale)}
	/>
{/if}
