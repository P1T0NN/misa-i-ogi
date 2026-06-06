<script lang="ts">
    // COMPONENTS
	import Card from '@/shared/components/ui/card/card.svelte';
	import CardContent from '@/shared/components/ui/card/card-content.svelte';

	// TYPES
	import type { DashboardStat } from './dashboard-stats.svelte';

	let { stat }: { stat: DashboardStat } = $props();

	const Icon = $derived(stat.icon);
</script>

<Card class="py-0">
	<CardContent class="flex items-start justify-between gap-4 p-4">
		<div class="min-w-0">
			<p class="text-xs font-medium text-muted-foreground">{stat.label}</p>
			<p class="mt-2 text-2xl font-semibold">{stat.value}</p>
			<p class="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.detail}</p>
		</div>

		<span class="rounded-md border border-border bg-muted p-2 text-muted-foreground">
			<Icon class="size-4" />
		</span>
	</CardContent>
</Card>
