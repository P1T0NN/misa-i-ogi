<script lang="ts">
	// LIBRARIES
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import ScanAccommodationPartnershipsEmpty from '@/shared/components/pages/(unprotected)/scan/empty/scan-accommodation-partnerships-empty.svelte';
	import ScanPartnershipsSectionItem from '@/shared/components/pages/(unprotected)/scan/stay-accommodation-data/scan-partnerships-section-item.svelte';
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';

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
			{m['ScanPage.partnersTitle']({ city })}
		</h2>
	{:else}
		<header class="mb-2 flex flex-col gap-2">
			<p class="mb-0 font-mono text-[10px] tracking-eyebrow text-primary uppercase">
				{m['ScanPage.partnerBenefitsEyebrow']()}
			</p>
			<h2 id="partners-heading" class="mb-0 font-serif text-2xl leading-tight font-medium sm:text-3xl">
				{m['ScanPage.partnersTitle']({ city })}
			</h2>
			<p class="mb-0 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
				{m['ScanPage.partnersLead']()}
			</p>
		</header>

		{#if partnershipsQuery.error}
			<div
				role="alert"
				class="flex flex-col gap-1.5 rounded-xl border border-border/80 bg-card p-5"
			>
				<h3 class="mb-0 font-serif text-lg font-medium">{m['ScanPage.ScanError.title']()}</h3>
				<p class="mb-0 text-sm leading-relaxed text-muted-foreground">
					{m['ScanPage.ScanError.body']()}
				</p>
			</div>
		{:else if isLoading}
			<p class="sr-only" aria-live="polite">{m['ScanPage.ScanLoading.announce']()}</p>
			<div class="flex flex-col gap-3">
				{#each [0, 1, 2] as row (row)}
					<div class="flex gap-3 rounded-xl border border-border/80 bg-card p-3 sm:p-4">
						<Skeleton class="size-24 shrink-0 rounded-lg" />
						<div class="flex flex-1 flex-col gap-2 py-1">
							<Skeleton class="h-3 w-20" />
							<Skeleton class="h-6 max-w-48" />
							<div class="mt-auto flex items-center justify-between gap-3">
								<Skeleton class="h-5 w-16 rounded-full" />
								<Skeleton class="h-4 w-20" />
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if partnerships?.length === 0}
			<ScanAccommodationPartnershipsEmpty />
		{:else if partnerships}
			<ul class="flex flex-col gap-3 sm:gap-4">
				{#each partnerships as partnership (partnership._id)}
					<ScanPartnershipsSectionItem {partnership} />
				{/each}
			</ul>
		{/if}
	{/if}
</section>
