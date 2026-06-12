<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { getLocale } from '@/shared/lib/paraglide/runtime';

	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';

	// TYPES
	import type { AdminAnalyticsTrendPoint } from '@/convex/pages/adminAnalytics/types/adminAnalyticsTypes';
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';

	let { data }: { data: AdminAnalyticsTrendPoint[] } = $props();

	const locale = $derived(getLocale());

	const chartData = $derived(data.map((point) => ({ ...point, date: new Date(point.date) })));

	const chartConfig = {
		qrScans: {
			label: m['AdminAnalyticsPage.AdminAnalyticsTrendChart.qrScans'](),
			color: 'var(--chart-1)'
		},
		guestActivations: {
			label: m['AdminAnalyticsPage.AdminAnalyticsTrendChart.guestActivations'](),
			color: 'var(--success)'
		},
		hospitalityViews: {
			label: m['AdminAnalyticsPage.AdminAnalyticsTrendChart.hospitalityViews'](),
			color: 'var(--chart-2)'
		},
		newReservations: {
			label: m['AdminAnalyticsPage.AdminAnalyticsTrendChart.newReservations'](),
			color: 'var(--chart-3)'
		},
		confirmedReservations: {
			label: m['AdminAnalyticsPage.AdminAnalyticsTrendChart.confirmedReservations'](),
			color: 'var(--chart-4)'
		}
	} satisfies ChartConfig;
</script>

<AreaChartInteractive
	data={chartData}
	x="date"
	config={chartConfig}
	timeRange="30d"
	title={m['AdminAnalyticsPage.AdminAnalyticsTrendChart.title']()}
	description={m['AdminAnalyticsPage.AdminAnalyticsTrendChart.description']()}
	cardClass="py-0"
	cardContentClass="px-2 pb-4 sm:px-4"
	containerClass="aspect-auto h-96 w-full"
	yAxisFormat={(value) => Number(value).toLocaleString(locale)}
	tooltipIndicator="dot"
/>
