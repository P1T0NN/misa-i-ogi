<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { getLocale } from '@/shared/lib/paraglide/runtime';

	// COMPONENTS
	import LazyAreaChartInteractive from '@/shared/components/ui/custom-charts/lazy-area-chart-interactive.svelte';

	// DATA
	import {
		landingAccommodationAnalyticsAreaChartData,
		landingHospitalityAnalyticsAreaChartData
	} from '@/shared/data/dummyData';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { TimeRangeOption } from '@/shared/components/ui/custom-charts/timerange-data.svelte';

	const locale = $derived(getLocale());

	const formatChartValue = (value?: unknown) => Number(value).toLocaleString(locale);

	const hospitalityAnalyticsChartConfig = $derived({
		guestViews: {
			label: m['HomePage.FeatureOneRightSide.guestViews'](),
			color: 'var(--chart-1)'
		},
		reservationRequests: {
			label: m['HomePage.FeatureOneRightSide.reservationRequests'](),
			color: 'var(--chart-3)'
		}
	} satisfies ChartConfig);

	const accommodationAnalyticsChartConfig = $derived({
		qrScans: {
			label: m['HomePage.FeatureOneRightSide.qrScans'](),
			color: 'var(--chart-1)'
		},
		guestActivations: {
			label: m['HomePage.FeatureOneRightSide.guestActivations'](),
			color: 'var(--success)'
		},
		reservationRequests: {
			label: m['HomePage.FeatureOneRightSide.reservationRequests'](),
			color: 'var(--chart-3)'
		}
	} satisfies ChartConfig);

	const landingAnalyticsXAxisTicks = [
		new Date('2026-05-17'),
		new Date('2026-05-24'),
		new Date('2026-05-31'),
		new Date('2026-06-07'),
		new Date('2026-06-14')
	];

	const landingAnalyticsAreaChartProps = {
		xAxis: {
			ticks: landingAnalyticsXAxisTicks
		}
	};

	const chartTimeRangeOptions = $derived<TimeRangeOption[]>([
		{
			value: '30d',
			label: m['HomePage.FeatureOneRightSide.last30Days'](),
			days: 30
		},
		{
			value: '7d',
			label: m['HomePage.FeatureOneRightSide.last7Days'](),
			days: 7
		}
	]);
</script>

<div
	class="relative grid gap-5 sm:gap-6 lg:block lg:min-h-188"
	aria-label={m['HomePage.FeatureOneRightSide.ariaLabel']()}
>
	<div
		class="pointer-events-none absolute inset-x-6 top-10 h-48 rounded-full bg-primary/10 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative z-20 w-full lg:absolute lg:-top-8 lg:left-0 lg:w-[84%]">
		<LazyAreaChartInteractive
			data={landingAccommodationAnalyticsAreaChartData}
			x="date"
			config={accommodationAnalyticsChartConfig}
			timeRange="30d"
			timeRangeOptions={chartTimeRangeOptions}
			areaChartProps={landingAnalyticsAreaChartProps}
			title={m['HomePage.FeatureOneRightSide.accommodationTitle']()}
			description={m['HomePage.FeatureOneRightSide.accommodationDescription']()}
			cardClass="overflow-hidden rounded-2xl border border-border-2 bg-card py-0 shadow-dashboard-card"
			cardHeaderClass="flex items-start gap-3 border-b border-border-2 px-4 py-4 sm:flex-row"
			cardContentClass="px-2 pt-3 pb-4 sm:px-4"
			containerClass="aspect-auto h-[13.5rem] w-full sm:h-[14.5rem] lg:h-60"
			yAxisFormat={formatChartValue}
			tooltipIndicator="dot"
		/>
	</div>

	<div class="relative z-10 w-full lg:absolute lg:right-0 lg:bottom-0 lg:w-[84%]">
		<LazyAreaChartInteractive
			data={landingHospitalityAnalyticsAreaChartData}
			x="date"
			config={hospitalityAnalyticsChartConfig}
			timeRange="30d"
			timeRangeOptions={chartTimeRangeOptions}
			areaChartProps={landingAnalyticsAreaChartProps}
			title={m['HomePage.FeatureOneRightSide.hospitalityTitle']()}
			description={m['HomePage.FeatureOneRightSide.hospitalityDescription']()}
			cardClass="overflow-hidden rounded-2xl border border-border-2 bg-card py-0 shadow-dashboard-card"
			cardHeaderClass="flex items-start gap-3 border-b border-border-2 px-4 py-4 sm:flex-row"
			cardContentClass="px-2 pt-3 pb-4 sm:px-4"
			containerClass="aspect-auto h-[13.5rem] w-full sm:h-[14.5rem] lg:h-60"
			yAxisFormat={formatChartValue}
			tooltipIndicator="dot"
		/>
	</div>
</div>
