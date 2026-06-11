<script lang="ts">
	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';

	// TYPES
	import type { AdminAnalyticsTrendPoint } from '@/convex/pages/adminAnalytics/types/adminAnalyticsTypes';
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';

	let { data }: { data: AdminAnalyticsTrendPoint[] } = $props();

	const chartData = $derived(data.map((point) => ({ ...point, date: new Date(point.date) })));

	const chartConfig = {
		qrScans: {
			label: 'QR scans',
			color: 'var(--chart-1)'
		},
		guestActivations: {
			label: 'Guest activations',
			color: 'var(--success)'
		},
		hospitalityViews: {
			label: 'Hospitality views',
			color: 'var(--chart-2)'
		},
		newReservations: {
			label: 'Requests',
			color: 'var(--chart-3)'
		},
		confirmedReservations: {
			label: 'Confirmed',
			color: 'var(--chart-4)'
		}
	} satisfies ChartConfig;
</script>

<AreaChartInteractive
	data={chartData}
	x="date"
	config={chartConfig}
	timeRange="30d"
	title="Platform activity"
	description="Global guest activity and reservation demand over the last 30 days."
	cardClass="py-0"
	cardContentClass="px-2 pb-4 sm:px-4"
	containerClass="aspect-auto h-96 w-full"
	yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
	tooltipIndicator="dot"
/>
