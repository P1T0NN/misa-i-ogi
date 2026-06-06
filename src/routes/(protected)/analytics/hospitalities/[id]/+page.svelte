<script lang="ts">
	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsPlaceDetailPage from '@/features/analytics/components/analytics-place-detail-page.svelte';

	// DATA
	import { dummyUserAnalyticsHospitalityDetails } from '@/shared/data/dummyAnalyticsData';

	// TYPES
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const detail = $derived(
		dummyUserAnalyticsHospitalityDetails[params.id] ??
			dummyUserAnalyticsHospitalityDetails['mala-basta']
	);
</script>

<SvelteHead />

<AnalyticsPlaceDetailPage {detail} placeKind="hospitality" />
