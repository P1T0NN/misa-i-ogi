<script lang="ts">
	// LIBRARIES
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import StayPartnershipsEmpty from '@/shared/components/pages/(unprotected)/stay/empty/stay-partnerships-empty.svelte';
	import StayPartnershipsSectionItem from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-partnerships-section-item.svelte';
	import StayPartnershipsLoading from '@/shared/components/pages/(unprotected)/stay/loading/stay-partnerships-loading.svelte';
	import StayPartnershipsError from '@/shared/components/pages/(unprotected)/stay/error/stay-partnerships-error.svelte';

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

<section aria-labelledby="partners-heading" aria-busy={isLoading} class="flex flex-col gap-4">
	{#if !enabled}
		<!-- skipped: parent gates on active guest session -->
		<h2 id="partners-heading" class="sr-only">
			{m['StayPage.StayPartnershipsSection.partnersTitle']({ city })}
		</h2>
	{:else}
		<header class="mb-2 flex flex-col gap-2">
			<p class="mb-0 font-mono text-[10px] tracking-eyebrow text-primary uppercase">
				{m['StayPage.StayPartnershipsSection.partnerBenefitsEyebrow']()}
			</p>
			<h2 id="partners-heading" class="mb-0 font-serif text-2xl leading-tight font-medium sm:text-3xl">
				{m['StayPage.StayPartnershipsSection.partnersTitle']({ city })}
			</h2>
			<p class="mb-0 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
				{m['StayPage.StayPartnershipsSection.partnersLead']()}
			</p>
		</header>

		{#if partnershipsQuery.error}
			<StayPartnershipsError />
		{:else if isLoading}
			<StayPartnershipsLoading />
		{:else if partnerships?.length === 0}
			<StayPartnershipsEmpty />
		{:else if partnerships}
			<ul class="flex flex-col gap-3 sm:gap-4">
				{#each partnerships as partnership (partnership._id)}
					<StayPartnershipsSectionItem {partnership} />
				{/each}
			</ul>
		{/if}
	{/if}
</section>
