<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { typesPartnershipScanHospitalitySafe } from '@/features/partnerships/types/partnershipsTypes';

	// LUCIDE ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import StoreIcon from '@lucide/svelte/icons/store';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import XIcon from '@lucide/svelte/icons/x';

	let {
		hospitality,
		benefit = null,
		distanceLabel = null,
		onClose
	}: {
		hospitality: typesPartnershipScanHospitalitySafe;
		benefit?: string | null;
		distanceLabel?: string | null;
		onClose: () => void;
	} = $props();
</script>

<div
	class="pointer-events-auto absolute inset-x-0 bottom-0 border-t border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur-sm sm:p-4"
	role="region"
	aria-label={hospitality.name}
>
	<div class="flex gap-3">
		<div class="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted sm:size-16">
			{#if hospitality.coverImageUrl}
				<img
					src={hospitality.coverImageUrl}
					alt=""
					class="absolute inset-0 size-full object-cover"
					loading="lazy"
					decoding="async"
				/>
			{:else}
				<div class="flex size-full items-center justify-center text-muted-foreground">
					<StoreIcon class="size-5" aria-hidden="true" />
				</div>
			{/if}
		</div>

		<div class="flex min-w-0 flex-1 flex-col gap-1 pr-8">
			<span class="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
				{labelHospitalityType(hospitality.type)}
			</span>
			<p class="mb-0 line-clamp-2 font-serif text-base leading-snug font-medium">
				{hospitality.name}
			</p>
			{#if distanceLabel}
				<span class="flex items-center gap-1 text-xs text-muted-foreground">
					<MapPinIcon class="size-3 shrink-0" aria-hidden="true" />
					{m['StayPage.StayPartnershipsSectionItem.distanceAway']({ distance: distanceLabel })}
				</span>
			{/if}
			<div class="mt-1 flex flex-wrap items-center gap-2">
				{#if benefit}
					<Badge variant="secondary" class="bg-accent text-primary">
						{benefit}
					</Badge>
				{:else}
					<span class="text-xs text-muted-foreground">{hospitality.city}</span>
				{/if}
				<Button
					size="sm"
					href={UNPROTECTED_PAGE_ENDPOINTS.HOSPITALITY.replace(':id', hospitality._id)}
				>
					{m['StayPage.StayPartnershipsSectionItem.viewDetails']()}
					<ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
				</Button>
			</div>
		</div>

		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			class="absolute top-2 right-2 shrink-0 text-muted-foreground"
			onclick={onClose}
			aria-label={m['StayPage.StayLocationSection.closePanel']()}
		>
			<XIcon class="size-4" aria-hidden="true" />
		</Button>
	</div>
</div>
