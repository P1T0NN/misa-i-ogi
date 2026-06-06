<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';
	import UserAnalyticsOverviewQrScansLoading from './loading/user-analytics-overview-qr-scans-loading.svelte';
	import UserAnalyticsOverviewQrScansError from './error/user-analytics-overview-qr-scans-error.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { UserAnalyticsChartPoint } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	const qrScansQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsQrScansChart.fetchUserAnalyticsQrScansChart,
		() => ({})
	);

	const isLoading = $derived(qrScansQuery.data === undefined && !qrScansQuery.error);
	const hasError = $derived(Boolean(qrScansQuery.error));

	const chartConfig = {
		qrScans: {
			label: 'QR scans',
			color: 'var(--chart-1)'
		}
	} satisfies ChartConfig;

	const chartData = $derived(
		qrScansQuery.data?.map((p: UserAnalyticsChartPoint) => ({
			date: new Date(p.date),
			qrScans: p.value
		})) ?? []
	);
</script>

{#if isLoading}
	<UserAnalyticsOverviewQrScansLoading />
{:else if hasError}
	<UserAnalyticsOverviewQrScansError />
{:else}
	<AreaChartInteractive
		data={chartData}
		x="date"
		config={chartConfig}
		timeRange="30d"
		title="QR scans"
		description="Guest check-in scans from connected stays over time."
		cardClass="py-0"
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-72 w-full"
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
		tooltipIndicator="dot"
	/>
{/if}
