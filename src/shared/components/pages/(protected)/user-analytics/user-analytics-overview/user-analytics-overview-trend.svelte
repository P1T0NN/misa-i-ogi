<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { getLocale } from '@/shared/lib/paraglide/runtime';

	// COMPONENTS
	import LineChartInteractive from '@/shared/components/ui/custom-charts/line-chart-interactive.svelte';
	import UserAnalyticsOverviewTrendEmpty from './empty/user-analytics-overview-trend-empty.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsOverviewTrendPoint } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { data }: { data: UserAnalyticsOverviewTrendPoint[] } = $props();

	const locale = $derived(getLocale());

	const hasData = $derived(
		data.some((point) => point.qrScans > 0 || point.guestActivations > 0 || point.reservations > 0)
	);
	const chartData = $derived(data.map((point) => ({ ...point, date: new Date(point.date) })));

	const chartConfig = $derived({
		qrScans: {
			label: m['AnalyticsOverviewPage.UserAnalyticsOverviewTrend.qrScans'](),
			color: 'var(--chart-1)'
		},
		guestActivations: {
			label: m['AnalyticsOverviewPage.UserAnalyticsOverviewTrend.guestActivations'](),
			color: 'var(--success)'
		},
		reservations: {
			label: m['AnalyticsOverviewPage.UserAnalyticsOverviewTrend.reservations'](),
			color: 'var(--chart-3)'
		}
	} satisfies ChartConfig);
</script>

{#if !hasData}
	<UserAnalyticsOverviewTrendEmpty />
{:else}
	<LineChartInteractive
		data={chartData}
		x="date"
		config={chartConfig}
		title={m['AnalyticsOverviewPage.UserAnalyticsOverviewTrend.title']()}
		description={m['AnalyticsOverviewPage.UserAnalyticsOverviewTrend.description']()}
		cardClass="py-0"
		containerClass="aspect-auto h-72 w-full"
		yAxisFormat={(value) => Number(value).toLocaleString(locale)}
		tooltipIndicator="dot"
	/>
{/if}
