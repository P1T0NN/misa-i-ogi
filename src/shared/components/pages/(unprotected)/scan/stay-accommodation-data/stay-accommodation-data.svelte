<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import CopyButton from '@/shared/components/ui/copy-button/copy-button.svelte';
	import ScanPartnershipsSection from '@/shared/components/pages/(unprotected)/scan/stay-accommodation-data/scan-partnerships-section.svelte';

	// DATA
	import { labelAccommodationType } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';

	// LUCIDE ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	let {
		accommodation,
		sharingCode,
		perksUnlocked
	}: {
		accommodation: AccommodationStayDetailsSafe;
		sharingCode: string;
		perksUnlocked: boolean;
	} = $props();
</script>

<article class="pb-10 sm:pb-12 lg:pb-16">
	<div
		class="relative aspect-4/3 w-full overflow-hidden bg-muted sm:aspect-2/1 lg:mx-auto lg:mt-5 lg:max-w-7xl lg:rounded-2xl"
	>
		<img
			src={accommodation.coverImageUrl}
			alt=""
			class="absolute inset-0 size-full object-cover"
			decoding="async"
			fetchpriority="high"
		/>
	</div>

	<div
		class="mx-auto grid w-full max-w-7xl gap-8 px-3 pt-5 sm:px-4 sm:pt-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-x-12 lg:gap-y-9 lg:px-8 lg:pt-9"
	>
		<section aria-labelledby="stay-heading" class="min-w-0">
			<header class="flex flex-col gap-3 border-b border-border/80 pb-6 sm:pb-8">
				<p class="mb-0 font-mono text-[11px] tracking-eyebrow text-primary uppercase">
					{m['ScanPage.eyebrow']()} · {labelAccommodationType(accommodation.type)}
				</p>

				<h1
					id="stay-heading"
					class="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl"
				>
					{accommodation.name}
				</h1>

				<div
					class="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground sm:text-base"
				>
					<MapPinIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<span>{accommodation.address}, {accommodation.city}, {accommodation.country}</span>
				</div>

				{#if accommodation.description}
					<p
						class="mb-0 max-w-prose pt-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90"
					>
						{accommodation.description}
					</p>
				{/if}
			</header>
		</section>

		<aside
			aria-labelledby="share-stay-heading"
			class="rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1"
		>
			<p class="mb-2 font-mono text-[10px] tracking-eyebrow text-primary uppercase">
				{m['ScanPage.ScanSharingCode.eyebrow']()}
			</p>
			<h2 id="share-stay-heading" class="mb-3 font-serif text-xl leading-snug font-medium">
				{m['ScanPage.ScanSharingCode.title']()}
			</h2>
			<p class="mb-4 text-sm leading-relaxed text-muted-foreground">
				{m['ScanPage.ScanSharingCode.body']()}
			</p>

			<div
				class="mb-3 flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2.5"
			>
				<code class="font-mono text-lg tracking-eyebrow text-foreground">{sharingCode}</code>
				<CopyButton
					value={sharingCode}
					label={m['ScanPage.ScanSharingCode.copy']()}
					class="shrink-0 text-muted-foreground"
				/>
			</div>

			<p class="mb-0 text-xs leading-relaxed text-muted-foreground">
				{m['ScanPage.ScanSharingCode.privacy']()}
			</p>
		</aside>

		<div class="min-w-0 lg:col-start-1 lg:row-start-2">
			<ScanPartnershipsSection city={accommodation.city} enabled={perksUnlocked} />
		</div>
	</div>
</article>
