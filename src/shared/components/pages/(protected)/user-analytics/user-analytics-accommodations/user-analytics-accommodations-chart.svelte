<script lang="ts">
	// COMPONENTS
	import BarChart from '@/shared/components/ui/custom-charts/charts-only/bar-chart.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsBarChartRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { data }: { data: UserAnalyticsBarChartRow[] } = $props();

	const chartConfig = {
		value: {
			label: 'Requests',
			color: 'var(--chart-1)'
		}
	} satisfies ChartConfig;
</script>

{#if data.length === 0}
	<Card>
		<CardHeader>
			<CardTitle>Stays by reservation requests</CardTitle>
			<CardDescription>Which accommodations create the most hospitality demand.</CardDescription>
		</CardHeader>
		<CardContent class="flex h-80 items-center justify-center px-4 text-center">
			<p class="text-sm text-muted-foreground">
				Reservation activity will appear here after guests submit requests from your stays.
			</p>
		</CardContent>
	</Card>
{:else}
	<BarChart
		{data}
		x="name"
		y="value"
		config={chartConfig}
		preset="default"
		title="Stays by reservation requests"
		description="Which accommodations create the most hospitality demand."
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-80 w-full"
		tooltipIndicator="dot"
		xAxisFormat={(value) => String(value)}
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
		yNice={5}
	/>
{/if}
