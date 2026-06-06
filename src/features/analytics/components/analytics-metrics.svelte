<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';

	// TYPES
	import type { AnalyticsMetric } from '../types/analyticsTypes';

	let { metrics }: { metrics: AnalyticsMetric[] } = $props();
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	{#each metrics as metric (metric.id)}
		<Card class="py-0">
			<CardContent class="flex min-h-28 flex-col justify-between gap-4 p-4">
				<div>
					<p class="text-xs font-medium text-muted-foreground">{metric.label}</p>
					<p class="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
				</div>

				<div>
					{#if metric.tone === 'positive'}
						<Badge variant="success">{metric.trend}</Badge>
					{:else if metric.tone === 'warning'}
						<Badge variant="destructive">{metric.trend}</Badge>
					{:else}
						<Badge variant="outline">{metric.trend}</Badge>
					{/if}
				</div>
			</CardContent>
		</Card>
	{/each}
</div>
