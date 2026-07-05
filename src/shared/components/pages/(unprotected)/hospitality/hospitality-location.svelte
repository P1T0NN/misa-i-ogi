<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import LocationMap from '@/shared/components/ui/location-map/location-map.svelte';

	// TYPES
	import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	let { hospitality }: { hospitality: HospitalityDetailsSafe } = $props();

	const mapQuery = $derived(
		`${hospitality.address}, ${hospitality.city}, ${hospitality.country}`
	);

	const hasCoordinates = $derived(
		typeof hospitality.latitude === 'number' && typeof hospitality.longitude === 'number'
	);
</script>

<section class="scroll-mt-28" aria-labelledby="location-heading">
	<h2 id="location-heading" class="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
		{m['HospitalityPage.HospitalityLocation.title']()}
	</h2>

	<p class="mt-1 text-sm text-muted-foreground">
		{m['HospitalityPage.HospitalityLocation.addressLineMeta']({
			address: hospitality.address,
			city: hospitality.city,
			country: hospitality.country
		})}
	</p>

	{#if hasCoordinates}
		<LocationMap
			lat={hospitality.latitude}
			lng={hospitality.longitude}
			query={mapQuery}
			zoom={15}
			iframe
			class="mt-6 aspect-16/10 sm:aspect-2/1"
		/>
	{/if}
</section>
