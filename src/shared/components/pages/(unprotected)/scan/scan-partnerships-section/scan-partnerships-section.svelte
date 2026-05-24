<script lang="ts">
	// LIBRARIES
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import ScanAccommodationPartnershipsEmpty from '@/shared/components/pages/(unprotected)/scan/empty/scan-accommodation-partnerships-empty.svelte';
	import ScanError from '@/shared/components/pages/(unprotected)/scan/error/scan-error.svelte';
	import ScanLoading from '@/shared/components/pages/(unprotected)/scan/loading/scan-loading.svelte';
	import ScanPartnershipsSectionItem from '@/shared/components/pages/(unprotected)/scan/scan-partnerships-section/scan-partnerships-section-item.svelte';

	// TYPES
	import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	let {
		city,
		enabled = true
	}: {
		city: string;
		enabled?: boolean;
	} = $props();

	const partnershipsQuery = useQuery(
		api.tables.partnerships.queries.fetchAccommodationPartnerships.fetchAccommodationPartnerships,
		() => (enabled ? {} : 'skip')
	);

	const partnerships = $derived(
		partnershipsQuery.data as AccommodationPartnershipSafe[] | undefined
	);
	const isLoading = $derived(enabled && partnerships === undefined && !partnershipsQuery.error);
</script>

<section aria-labelledby="perks-heading" class="flex flex-col gap-4">
	<h2 id="perks-heading" class="sr-only">
		{m['ScanPage.perksTitle']({ city })}
	</h2>

	{#if !enabled}
		<!-- skipped — parent gates on active guest session -->
	{:else if partnershipsQuery.error}
		<ScanError />
	{:else if isLoading}
		<ScanLoading />
	{:else if partnerships?.length === 0}
		<ScanAccommodationPartnershipsEmpty />
	{:else if partnerships}
		<ul class="flex flex-col gap-3">
			{#each partnerships as partnership (partnership._id)}
				<ScanPartnershipsSectionItem {partnership} />
			{/each}
		</ul>
	{/if}
</section>
