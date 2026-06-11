<script lang="ts">
	// COMPONENTS
	import Card from '@/shared/components/ui/card/card.svelte';
	import CardContent from '@/shared/components/ui/card/card-content.svelte';

	// TYPES
	import type { Component } from 'svelte';
	import type { DashboardStat } from './dashboard-stats.svelte';

	let {
		metric,
		icon: Icon
	}: {
		metric: DashboardStat;
		icon: Component<{ class?: string }>;
	} = $props();
</script>

<Card class="py-0">
	<CardContent class="flex min-h-28 items-start justify-between gap-4 p-4">
		<div class="min-w-0 flex-1">
			<p class="text-xs font-medium text-muted-foreground">{metric.label}</p>
			<p class="mt-2 text-2xl font-semibold">{metric.value}</p>
		</div>

		<span class="rounded-md border border-border bg-muted p-2 text-muted-foreground">
			<Icon class="size-4" />
		</span>
	</CardContent>
</Card>
