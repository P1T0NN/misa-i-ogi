<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';

	// COMPONENTS
	import CopyButton from '@/shared/components/ui/copy-button/copy-button.svelte';
	import StayLocationSection from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-location-section/stay-location-section.svelte';
	import StayPartnershipsSection from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-partnerships-section.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// DATA
	import { labelAccommodationType } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';
	import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	// LUCIDE ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	let {
		accommodation,
		sharingCode,
		partnersUnlocked
	}: {
		accommodation: AccommodationStayDetailsSafe;
		sharingCode: string;
		partnersUnlocked: boolean;
	} = $props();

	const hasCoords = $derived(
		typeof accommodation.latitude === 'number' && typeof accommodation.longitude === 'number'
	);

	// One partnerships query shared by the cards (left) and the map markers (right).
	const partnershipsQuery = useQuery(
		api.tables.partnerships.queries.fetchAccommodationPartnerships.fetchAccommodationPartnerships,
		() => (partnersUnlocked ? {} : 'skip')
	);
	const partnerships = $derived(
		partnershipsQuery.data as AccommodationPartnershipSafe[] | undefined
	);
	const partnershipsLoading = $derived(
		partnersUnlocked && partnerships === undefined && !partnershipsQuery.error
	);
	const partnershipsHasError = $derived(Boolean(partnershipsQuery.error));

	// The partner card the guest is hovering — drives the map's camera/highlight.
	let hoveredHospitalityId = $state<string | null>(null);
</script>

<article class="pb-10 sm:pb-12 lg:pb-16">
	<!-- Hero: full-width cover, height capped so the sharing code stays near the top.
	     Name + address overlaid (mirrors the sibling HospitalityPage hero). -->
	<div class="lg:px-8 lg:pt-6">
		<div class="relative w-full overflow-hidden bg-muted lg:mx-auto lg:max-w-7xl lg:rounded-2xl">
			<div class="relative aspect-16/10 max-h-[min(52vh,26rem)] w-full lg:max-h-[min(60vh,30rem)]">
				<img
					src={accommodation.coverImageUrl}
					alt=""
					class="absolute inset-0 size-full object-cover"
					decoding="async"
					fetchpriority="high"
				/>
				<div
					class="absolute inset-0 bg-linear-to-t from-background/95 via-background/35 to-transparent"
					aria-hidden="true"
				></div>
				<div class="absolute inset-x-0 bottom-0 px-4 pt-24 pb-6 sm:px-6 sm:pb-8 lg:px-8">
					<p class="mb-2 font-mono text-[11px] tracking-eyebrow text-primary uppercase">
						{m['StayPage.StayAccommodationData.eyebrow']()} · {labelAccommodationType(
							accommodation.type
						)}
					</p>
					<h1
						id="stay-heading"
						class="font-serif text-3xl leading-[1.1] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl"
					>
						{accommodation.name}
					</h1>
					<p class="mt-3 flex items-start gap-2 text-sm text-muted-foreground sm:text-base">
						<MapPinIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
						<span>{accommodation.address}, {accommodation.city}, {accommodation.country}</span>
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
		<!-- Sharing code: full-width band, the primary action, impossible to miss. -->
		<div class="rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
				<div class="flex min-w-0 flex-col gap-1">
					<p class="mb-0 font-mono text-[10px] tracking-eyebrow text-primary uppercase">
						{m['StayPage.StaySharingCode.eyebrow']()}
					</p>
					<h2
						id="share-stay-heading"
						class="mb-0 font-serif text-xl leading-snug font-medium sm:text-2xl"
					>
						{m['StayPage.StaySharingCode.title']()}
					</h2>
					<p class="mb-0 max-w-prose text-sm leading-relaxed text-muted-foreground">
						{m['StayPage.StaySharingCode.body']()}
					</p>
				</div>

				<div class="flex shrink-0 flex-col gap-2 sm:items-end">
					<div
						class="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
					>
						<code class="font-mono text-xl tracking-eyebrow text-foreground">{sharingCode}</code>
						<CopyButton
							value={sharingCode}
							label={m['StayPage.StaySharingCode.copy']()}
							class="shrink-0 text-muted-foreground"
						/>
					</div>
					<p class="mb-0 text-xs leading-relaxed text-muted-foreground sm:text-right">
						{m['StayPage.StaySharingCode.privacy']()}
					</p>
				</div>
			</div>
		</div>

		<!-- Details + partners (left) · map sidebar (right, sticky). -->
		<div
			class={cn('mt-8 grid gap-8 lg:mt-10 lg:items-start lg:gap-12', hasCoords && 'lg:grid-cols-2')}
		>
			<div class="flex min-w-0 flex-col gap-10">
				{#if accommodation.description}
					<p
						class="mb-0 max-w-prose text-sm leading-relaxed whitespace-pre-wrap text-foreground/90"
					>
						{accommodation.description}
					</p>
				{/if}

				<StayPartnershipsSection
					city={accommodation.city}
					enabled={partnersUnlocked}
					{partnerships}
					isLoading={partnershipsLoading}
					hasError={partnershipsHasError}
					originLat={accommodation.latitude}
					originLng={accommodation.longitude}
					onHover={(id) => (hoveredHospitalityId = id)}
				/>
			</div>

			{#if hasCoords}
				<div class="lg:sticky lg:top-20">
					<StayLocationSection
						latitude={accommodation.latitude as number}
						longitude={accommodation.longitude as number}
						accommodationId={accommodation._id}
						accommodationName={accommodation.name}
						partnerships={partnerships ?? []}
						focusedId={hoveredHospitalityId}
					/>
				</div>
			{/if}
		</div>
	</div>
</article>
