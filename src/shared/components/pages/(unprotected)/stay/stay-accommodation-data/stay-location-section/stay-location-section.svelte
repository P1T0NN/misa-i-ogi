<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import StayLocationSectionMap from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-location-section/stay-location-section-map.svelte';

	// TYPES
	import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	let {
		latitude,
		longitude,
		accommodationId,
		accommodationName,
		partnerships,
		focusedId = null
	}: {
		latitude: number;
		longitude: number;
		accommodationId: string;
		accommodationName: string;
		partnerships: AccommodationPartnershipSafe[];
		focusedId?: string | null;
	} = $props();
</script>

<section aria-labelledby="location-heading" class="flex flex-col gap-3">
	<h2
		id="location-heading"
		class="mb-0 font-serif text-lg leading-snug font-medium tracking-tight sm:text-xl"
	>
		{m['StayPage.StayLocationSection.title']()}
	</h2>

	<StayLocationSectionMap
		{latitude}
		{longitude}
		{accommodationId}
		{accommodationName}
		{partnerships}
		{focusedId}
	/>
</section>
