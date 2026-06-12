<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

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

	const isFiltered = $derived(searchQuery.trim() !== '' || selectedHospitality !== 'all');
</script>

<Card class="border-dashed">
	<CardContent class="flex flex-col items-center gap-2 py-12 text-center">
		<ClockIcon class="size-8 text-muted-foreground" />
		<p class="text-sm font-medium">
			{m['ReservationsPage.ReservationsPastTabEmpty.title']()}
		</p>
		<p class="text-xs text-muted-foreground">
			{#if isFiltered}
				{m['ReservationsPage.ReservationsPastTabEmpty.filteredDescription']()}
			{:else}
				{m['ReservationsPage.ReservationsPastTabEmpty.description']()}
			{/if}
		</p>
	</CardContent>
</Card>
