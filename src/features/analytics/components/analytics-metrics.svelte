<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';
	import AnalyticsMetricLabelBadge from './analytics-metric-label-badge.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// TYPES
	import type { AnalyticsMetric } from '../types/analyticsTypes';

	// LUCIDE ICONS
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
	import MinusIcon from '@lucide/svelte/icons/minus';

	let {
		metrics,
		class: className = '',
		columns = 4
	}: {
		metrics: AnalyticsMetric[];
		class?: string;
		/** Max columns at the xl breakpoint — match the number of tiles for a gap-free row. */
		columns?: 3 | 4 | 5;
	} = $props();

	const XL_COLUMNS_CLASS = {
		3: 'xl:grid-cols-3',
		4: 'xl:grid-cols-4',
		5: 'xl:grid-cols-5'
	} as const;

	const SENTIMENT_CLASS = {
		positive: 'text-success',
		negative: 'text-destructive',
		neutral: 'text-muted-foreground'
	} as const;

	const DIRECTION_ICON = {
		up: TrendingUpIcon,
		down: TrendingDownIcon,
		flat: MinusIcon
	} as const;
</script>

<div class={cn('grid gap-3 sm:grid-cols-2', XL_COLUMNS_CLASS[columns], className)}>
	{#each metrics as metric (metric.id)}
		<Card class="py-0">
			<CardContent class="flex min-h-28 flex-col justify-between gap-4 p-4">
				<div>
					<p class="text-xs font-medium text-muted-foreground">{metric.label}</p>
					<p class="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
				</div>

				{#if metric.delta}
					{@const DeltaIcon = DIRECTION_ICON[metric.delta.direction]}
					<div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
						{#if metric.delta.deltaPercent !== undefined}
							<span
								class={cn(
									'inline-flex items-center gap-1 font-medium tabular-nums',
									SENTIMENT_CLASS[metric.delta.sentiment]
								)}
							>
								<DeltaIcon class="size-3.5" aria-hidden="true" />
								{Math.abs(metric.delta.deltaPercent)}%
							</span>
							<span class="text-muted-foreground">{m['AnalyticsShared.deltaVsPrevious']()}</span>
						{:else}
							<span class="text-muted-foreground">{m['AnalyticsShared.deltaNoPrevious']()}</span>
						{/if}
					</div>
				{:else if metric.analyticsLabel}
					<div>
						<AnalyticsMetricLabelBadge analyticsLabel={metric.analyticsLabel} />
					</div>
				{/if}
			</CardContent>
		</Card>
	{/each}
</div>
