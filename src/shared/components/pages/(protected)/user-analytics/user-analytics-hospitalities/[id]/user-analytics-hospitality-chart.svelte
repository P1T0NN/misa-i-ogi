<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';

	let {
		data
	}: { data: { date: number; qrScans: number; guestActivations: number; reservations: number }[] } =
		$props();

	const chartData = $derived(data.map((p) => ({ ...p, date: new Date(p.date) })));

	const chartConfig = $derived({
		qrScans: {
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityChart.guestViews'](),
			color: 'var(--chart-1)'
		},
		reservations: {
			label: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityChart.reservations'](),
			color: 'var(--chart-3)'
		}
	} satisfies ChartConfig);
</script>

<AreaChartInteractive
	data={chartData}
	x="date"
	config={chartConfig}
	timeRange="30d"
	title={m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityChart.title']()}
	description={m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityChart.description']()}
	cardClass="py-0"
	cardContentClass="px-2 pb-4 sm:px-4"
	containerClass="aspect-auto h-80 w-full"
	yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
	tooltipIndicator="dot"
/>
