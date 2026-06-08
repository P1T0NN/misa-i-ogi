<script lang="ts">
	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsChartPoint } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { data }: { data: UserAnalyticsChartPoint[] } = $props();

	const chartConfig = {
		guestActivations: {
			label: 'Guest activations',
			color: 'var(--success)'
		}
	} satisfies ChartConfig;

	const chartData = $derived(
		data.map((point) => ({
			date: new Date(point.date),
			guestActivations: point.value
		}))
	);
</script>

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
