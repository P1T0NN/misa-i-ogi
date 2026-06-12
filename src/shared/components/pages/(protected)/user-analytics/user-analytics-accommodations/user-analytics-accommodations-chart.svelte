<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import BarChart from '@/shared/components/ui/custom-charts/charts-only/bar-chart.svelte';
	import UserAnalyticsAccommodationsChartEmpty from './empty/user-analytics-accommodations-chart-empty.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsBarChartRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { data }: { data: UserAnalyticsBarChartRow[] } = $props();

	const chartConfig = $derived({
		value: {
			label: m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsChart.reservations'](),
			color: 'var(--chart-1)'
		}
	} satisfies ChartConfig);
</script>

{#if data.length === 0}
	<UserAnalyticsAccommodationsChartEmpty />
{:else}
	<BarChart
		{data}
		x="name"
		y="value"
		config={chartConfig}
		preset="default"
		title={m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsChart.title']()}
		description={m['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsChart.description']()}
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-80 w-full"
		tooltipIndicator="dot"
		xAxisFormat={(value) => String(value)}
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
		yNice={5}
	/>
{/if}
