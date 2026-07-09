<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import CopyButton from '@/shared/components/ui/copy-button/copy-button.svelte';
	import StayLocationSection from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-location-section/stay-location-section.svelte';
	import StayLocationSectionMap from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-location-section/stay-location-section-map.svelte';
	import StayPartnershipsSection from '@/shared/components/pages/(unprotected)/stay/stay-accommodation-data/stay-partnerships-section.svelte';
	import * as Drawer from '@/shared/components/ui/drawer/index.js';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// DATA
	import { labelAccommodationType } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';
	import type { PartnershipAccommodationSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	// LUCIDE ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import MapIcon from '@lucide/svelte/icons/map';

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

	let partnerships = $state<PartnershipAccommodationSafe[]>([]);

	// The partner card the guest is hovering — drives the map's camera/highlight.
	let hoveredHospitalityId = $state<string | null>(null);

	// Mobile only: the inline map is hidden and revealed on demand in a bottom drawer.
	let mapOpen = $state(false);
</script>

<article class={cn('pb-10 sm:pb-12 lg:pb-16', hasCoords && 'max-lg:pb-28')}>
	<!-- Hero: full-width cover, height capped so the sharing code stays near the top.
	     Name + address overlaid (mirrors the sibling HospitalityPage hero). -->
	<div class="lg:px-8 lg:pt-6">
		<div class="relative w-full overflow-hidden bg-muted lg:mx-auto lg:max-w-420 lg:rounded-2xl">
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
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto w-full max-w-420 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
		<!-- Top row: address + platform teaser (left, fluid) sit on the same line as
		     the sharing code card (right rail, aligned to the map column below). -->
		<div
			class={cn(
				'grid grid-cols-1 gap-8 lg:items-start lg:gap-10',
				hasCoords && 'lg:grid-cols-[minmax(0,1fr)_26rem]'
			)}
		>
			<!-- Sharing code -->
			<div
				class="rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6 lg:col-start-2 lg:row-start-1"
			>
				<div class="flex flex-col gap-4">
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

					<div class="flex flex-col gap-2">
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
						<p class="mb-0 text-xs leading-relaxed text-muted-foreground">
							{m['StayPage.StaySharingCode.privacy']()}
						</p>
					</div>
				</div>
			</div>

			<!-- Address + platform teaser -->
			<div class="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
				<p class="mb-0 flex items-start gap-2 text-sm text-muted-foreground">
					<MapPinIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<span>
						<span class="font-medium text-foreground"
							>{m['StayPage.StayAccommodationData.addressLabel']()}:</span
						>
						{accommodation.address}, {accommodation.city}, {accommodation.country}
					</span>
				</p>

				<div class="flex flex-col gap-2">
					<p
						class="mb-0 flex items-center gap-1.5 font-mono text-[10px] tracking-eyebrow text-primary uppercase"
					>
						<SparklesIcon class="size-3.5" aria-hidden="true" />
						{m['StayPage.StayAccommodationData.perksEyebrow']()}
					</p>
					<h2 class="mb-0 font-serif text-xl leading-snug font-medium sm:text-2xl">
						{m['StayPage.StayAccommodationData.perksTitle']()}
					</h2>
					<p class="mb-0 max-w-prose text-sm leading-relaxed text-muted-foreground">
						{m['StayPage.StayAccommodationData.perksBody']()}
					</p>
				</div>
			</div>
		</div>

		<!-- Partners (left, fluid — cards flow into 2 columns when wide) · map rail
		     (right, sticky). -->
		<div
			class={cn(
				'mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:items-start lg:gap-10',
				hasCoords && 'lg:grid-cols-[minmax(0,1fr)_26rem]'
			)}
		>
			<div class="min-w-0">
				<StayPartnershipsSection
					city={accommodation.city}
					enabled={partnersUnlocked}
					bind:partnerships
					originLat={accommodation.latitude}
					originLng={accommodation.longitude}
					onHover={(id) => (hoveredHospitalityId = id)}
				/>
			</div>

			{#if hasCoords}
				<div class="hidden lg:sticky lg:top-20 lg:block">
					<StayLocationSection
						latitude={accommodation.latitude as number}
						longitude={accommodation.longitude as number}
						accommodationId={accommodation._id}
						accommodationName={accommodation.name}
						{partnerships}
						focusedId={hoveredHospitalityId}
					/>
				</div>
			{/if}
		</div>
	</div>

	{#if hasCoords}
		<!-- Mobile only: floating pill that reveals the map in a bottom drawer. -->
		<Drawer.Root bind:open={mapOpen}>
			<div
				class="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] lg:hidden"
			>
				<button
					type="button"
					onclick={() => (mapOpen = true)}
					class="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95"
				>
					<MapIcon class="size-4" aria-hidden="true" />
					{m['StayPage.StayLocationSection.openMapMobile']()}
				</button>
			</div>

			<Drawer.Content>
				<Drawer.Header class="pb-2 text-left">
					<Drawer.Title class="font-serif text-lg font-medium">
						{m['StayPage.StayLocationSection.title']()}
					</Drawer.Title>
				</Drawer.Header>
				<div class="px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
					<StayLocationSectionMap
						latitude={accommodation.latitude as number}
						longitude={accommodation.longitude as number}
						accommodationId={accommodation._id}
						accommodationName={accommodation.name}
						{partnerships}
						mapClass="h-[62vh] w-full rounded-lg border"
					/>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
</article>
