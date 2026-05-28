<script lang="ts">
	// LIBRARIES
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';

	// COMPONENTS
	import StayError from '@/shared/components/pages/(unprotected)/stay/error/stay-error.svelte';
	import StayLoading from '@/shared/components/pages/(unprotected)/stay/loading/stay-loading.svelte';
	import StayAccommodationData from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-accommodation-data.svelte';

	// ROUTE CONTEXT
	import { useStayRouteContext } from './stayContext.svelte.js';

	// TYPES
	import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';

	const stay = useStayRouteContext();
	const sharingCode = $derived(stay.sharingCode);

	const accommodationQuery = useQuery(
		api.tables.accommodations.queries.fetchAccommodationDetails.fetchAccommodationDetails,
		() => (stay.currentGuest?.status === 'active' ? {} : 'skip'),
		() => ({ keepPreviousData: true })
	);

	const accommodation = $derived(
		accommodationQuery.data as AccommodationStayDetailsSafe | null | undefined
	);
	const isLoading = $derived(accommodation === undefined && !accommodationQuery.error);
	const loadError = $derived(Boolean(accommodationQuery.error));
	const partnersUnlocked = $derived(accommodation != null);
</script>

{#if loadError}
	<StayError />
{:else if isLoading}
	<StayLoading />
{:else if accommodation === null}
	<StayError />
{:else if accommodation && sharingCode}
	<StayAccommodationData {accommodation} {sharingCode} {partnersUnlocked} />
{/if}
