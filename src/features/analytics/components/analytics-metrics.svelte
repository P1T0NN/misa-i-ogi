<script lang="ts">
	// COMPONENTS
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';
	import AnalyticsMetricLabelBadge from './analytics-metric-label-badge.svelte';

	// TYPES
	import type { AnalyticsMetric } from '../types/analyticsTypes';

	let {
		metrics,
		class: className = ''
	}: {
		metrics: AnalyticsMetric[];
		class?: string;
	} = $props();
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 {className}">
	{#each metrics as metric (metric.id)}
		<Card class="py-0">
			<CardContent class="flex min-h-28 flex-col justify-between gap-4 p-4">
				<div>
					<p class="text-xs font-medium text-muted-foreground">{metric.label}</p>
					<p class="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
				</div>

				{#if metric.analyticsLabel}
					<div>
						<AnalyticsMetricLabelBadge analyticsLabel={metric.analyticsLabel} />
					</div>
				{/if}
			</CardContent>
		</Card>
	{/each}
</div>
