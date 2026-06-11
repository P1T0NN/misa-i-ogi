<script lang="ts">
	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';

	let {
		data
	}: {
		data: {
			date: number;
			qrScans: number;
			guestActivations: number;
			reservations: number;
		}[];
	} = $props();

	const chartData = $derived(data.map((p) => ({ ...p, date: new Date(p.date) })));

	const chartConfig = {
		qrScans: { label: 'QR scans', color: 'var(--chart-1)' },
		guestActivations: { label: 'Guest activations', color: 'var(--success)' },
		reservations: { label: 'Reservations', color: 'var(--chart-3)' }
	} satisfies ChartConfig;
</script>

<AreaChartInteractive
	data={chartData}
	x="date"
	config={chartConfig}
	timeRange="30d"
	title="Activity trend"
	description="Recent scans, guest activations, and reservation requests for this place."
	cardClass="py-0"
	cardContentClass="px-2 pb-4 sm:px-4"
	containerClass="aspect-auto h-80 w-full"
	yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
	tooltipIndicator="dot"
/>
