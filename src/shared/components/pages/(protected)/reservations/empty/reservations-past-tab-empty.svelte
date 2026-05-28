<script lang="ts">
	// COMPONENTS
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';

	// LUCIDE ICONS
	import ClockIcon from '@lucide/svelte/icons/clock';

	let {
		searchQuery,
		selectedHospitality
	}: {
		searchQuery: string;
		selectedHospitality: string;
	} = $props();
</script>

<Card class="border-dashed">
	<CardContent class="flex flex-col items-center gap-2 py-12 text-center">
		<ClockIcon class="size-8 text-muted-foreground" />
		<p class="text-sm font-medium">No past reservations</p>
		<p class="text-xs text-muted-foreground">
			{#if searchQuery.trim() || selectedHospitality !== 'all'}
				No results match your filters.
			{:else}
				Completed reservations will be archived here.
			{/if}
		</p>
	</CardContent>
</Card>
