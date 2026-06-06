<script lang="ts">
	// COMPONENTS
	import AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
	import { Progress } from '@/shared/components/ui/progress/index.js';
	import AnalyticsHeader from './analytics-header.svelte';
	import AnalyticsMetrics from './analytics-metrics.svelte';
	import AnalyticsPerformanceTable from './analytics-performance-table.svelte';

	// TYPES
	import type { ChartConfig } from '@/shared/components/ui/chart/chart-utils.js';
	import type { DummyUserAnalyticsPlaceDetail } from '@/shared/data/dummyAnalyticsData';

	let {
		detail,
		placeKind
	}: {
		detail: DummyUserAnalyticsPlaceDetail;
		placeKind: 'accommodation' | 'hospitality';
	} = $props();

	const isAccommodation = $derived(placeKind === 'accommodation');

	const activityChartConfig = {
		qrScans: {
			label: 'QR scans',
			color: 'var(--chart-1)'
		},
		guestActivations: {
			label: 'Guest activations',
			color: 'var(--chart-2)'
		},
		reservations: {
			label: 'Reservations',
			color: 'var(--chart-3)'
		}
	} satisfies ChartConfig;
</script>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow={isAccommodation ? 'Accommodation analytics' : 'Hospitality analytics'}
		title={detail.title}
		description={
			isAccommodation
				? 'Guest access, partner demand, and reservation flow for this accommodation.'
				: 'Guest demand, reservation flow, and source stays for this hospitality.'
		}
		badge={detail.badge}
	/>

	<AnalyticsMetrics metrics={detail.metrics} />

	<AreaChartInteractive
		data={detail.activityData}
		x="date"
		config={activityChartConfig}
		timeRange="30d"
		title="Activity trend"
		description="Recent scans, guest activations, and reservation requests for this place."
		cardClass="py-0"
		cardContentClass="px-2 pb-4 sm:px-4"
		containerClass="aspect-auto h-80 w-full"
		yAxisFormat={(value) => Number(value).toLocaleString('en-US')}
		tooltipIndicator="dot"
	/>

	<div class="grid gap-6 xl:grid-cols-[minmax(20rem,0.45fr)_minmax(0,1fr)]">
		<Card class="py-0">
			<CardHeader>
				<CardTitle class="text-base">Guest funnel</CardTitle>
				<CardDescription>How guest activity turns into confirmed reservations.</CardDescription>
			</CardHeader>
			<CardContent class="flex flex-col gap-4">
				{#each detail.funnel as step (step.id)}
					<div class="flex flex-col gap-2">
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="text-sm font-medium">{step.label}</p>
								<p class="mt-1 text-xs text-muted-foreground">{step.detail}</p>
							</div>
							<p class="text-sm font-semibold">{step.value}</p>
						</div>
						<Progress value={step.progress} />
					</div>
				{/each}
			</CardContent>
		</Card>

		<Card class="py-0">
			<CardHeader>
				<CardTitle class="text-base">
					{#if isAccommodation}
						Partner performance
					{:else}
						Source stays
					{/if}
				</CardTitle>
				<CardDescription>
					{#if isAccommodation}
						Hospitalities guests opened from this accommodation.
					{:else}
						Accommodations that send guests to this hospitality.
					{/if}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<AnalyticsPerformanceTable
					rows={detail.performance.rows}
					nameColumnLabel={isAccommodation ? 'Hospitality' : 'Accommodation'}
				/>
			</CardContent>
		</Card>
	</div>
</section>
