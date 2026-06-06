<script lang="ts">
	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsPlaceDetailPage from '@/features/analytics/components/analytics-place-detail-page.svelte';

	// DATA
	import { dummyUserAnalyticsAccommodationDetails } from '@/shared/data/dummyAnalyticsData';

	// TYPES
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const detail = $derived(
		dummyUserAnalyticsAccommodationDetails[params.id] ??
			dummyUserAnalyticsAccommodationDetails['dorcol-loft-14']
	);
</script>

<SvelteHead />

<AnalyticsPlaceDetailPage {detail} placeKind="accommodation" />
