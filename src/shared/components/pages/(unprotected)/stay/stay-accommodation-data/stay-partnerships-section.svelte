<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';

	// CONFIG
	import { PAGINATION_DATA } from '@/shared/config';

	// COMPONENTS
	import StayPartnershipsEmpty from '@/shared/components/pages/(unprotected)/stay/empty/stay-partnerships-empty.svelte';
	import StayPartnershipsSectionItem from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-partnerships-section-item.svelte';
	import StayPartnershipsLoading from '@/shared/components/pages/(unprotected)/stay/loading/stay-partnerships-loading.svelte';
	import StayPartnershipsError from '@/shared/components/pages/(unprotected)/stay/error/stay-partnerships-error.svelte';
	import ConvexDataList from '@/shared/components/ui/data-list/convex-data-list.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';
	import type { PartnershipAccommodationSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	// TODO: Add in fetchOptimized to be able to map to safe instead of this.
	function toPlatformPartnership(hospitality: Doc<'hospitalities'>): PartnershipAccommodationSafe {
		return {
			benefit: hospitality.benefit,
			hospitality: {
				_id: hospitality._id,
				name: hospitality.name,
				type: hospitality.type,
				city: hospitality.city,
				coverImageUrl: hospitality.coverImageUrl,
				latitude: hospitality.latitude,
				longitude: hospitality.longitude
			}
		};
	}

	let {
		city,
		enabled = true,
		partnerships = $bindable<PartnershipAccommodationSafe[]>([]),
		originLat,
		originLng,
		onHover
	}: {
		city: string;
		enabled?: boolean;
		partnerships?: PartnershipAccommodationSafe[];
		originLat?: number | null;
		originLng?: number | null;
		onHover?: (hospitalityId: string | null) => void;
	} = $props();

	const customQuery = useQuery(
		api.tables.partnerships.queries.fetchAccommodationCustomPartnerships
			.fetchAccommodationCustomPartnerships,
		() => (enabled ? {} : 'skip')
	);

	let platformPage = $state<Doc<'hospitalities'>[]>([]);
	let platformQueryPending = $state(false);

	const customPartnerships = $derived(customQuery.data ?? []);
	const customReady = $derived(customQuery.data !== undefined || Boolean(customQuery.error));
	const hasError = $derived(Boolean(customQuery.error));
	const isEmpty = $derived(
		customReady &&
			!platformQueryPending &&
			customPartnerships.length === 0 &&
			platformPage.length === 0
	);

	$effect(() => {
		partnerships = [...customPartnerships, ...platformPage.map(toPlatformPartnership)];
	});
</script>

<section
	aria-labelledby="partners-heading"
	aria-busy={enabled && !customReady}
	class="flex flex-col gap-4"
>
	{#if !enabled}
		<h2 id="partners-heading" class="sr-only">
			{m['StayPage.StayPartnershipsSection.partnersTitle']({ city })}
		</h2>
	{:else}
		<header class="mb-2 flex flex-col gap-2">
			<p class="mb-0 font-mono text-[10px] tracking-eyebrow text-primary uppercase">
				{m['StayPage.StayPartnershipsSection.partnerBenefitsEyebrow']()}
			</p>
			<h2
				id="partners-heading"
				class="mb-0 font-serif text-2xl leading-tight font-medium sm:text-3xl"
			>
				{m['StayPage.StayPartnershipsSection.partnersTitle']({ city })}
			</h2>
			<p class="mb-0 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
				{m['StayPage.StayPartnershipsSection.partnersLead']()}
			</p>
		</header>

		{#if hasError}
			<StayPartnershipsError />
		{:else if !customReady}
			<StayPartnershipsLoading />
		{:else if isEmpty}
			<StayPartnershipsEmpty />
		{:else}
			{#if customPartnerships.length > 0}
				<ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 2xl:grid-cols-3">
					{#each customPartnerships as partnership (partnership.hospitality._id)}
						<StayPartnershipsSectionItem {partnership} {originLat} {originLng} {onHover} />
					{/each}
				</ul>
			{/if}

			<ConvexDataList
				query={api.tables.partnerships.queries.fetchStayPlatformPartnerships
					.fetchStayPlatformPartnerships}
				optimizationStrategy="cursor"
				pageSize={PAGINATION_DATA.MAX_PAGE_SIZE}
				listClass="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 2xl:grid-cols-3"
				bind:pageItems={platformPage}
				bind:queryPending={platformQueryPending}
				getItemKey={(hospitality) => String(hospitality._id)}
			>
				{#snippet item({ item })}
					{@const hospitality = item as Doc<'hospitalities'>}
					<StayPartnershipsSectionItem
						partnership={toPlatformPartnership(hospitality)}
						{originLat}
						{originLng}
						{onHover}
					/>
				{/snippet}

				{#snippet loading()}
					<StayPartnershipsLoading />
				{/snippet}
			</ConvexDataList>
		{/if}
	{/if}
</section>
