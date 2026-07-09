<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';

	// UTILS
	import { distanceMeters, formatDistance } from '@/utils/distance';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { PartnershipAccommodationSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import StoreIcon from '@lucide/svelte/icons/store';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import TagIcon from '@lucide/svelte/icons/tag';

	let {
		partnership,
		originLat,
		originLng,
		onHover
	}: {
		partnership: PartnershipAccommodationSafe;
		/** Accommodation coordinates, to show how far this partner is. */
		originLat?: number | null;
		originLng?: number | null;
		onHover?: (hospitalityId: string | null) => void;
	} = $props();

	const hospitality = $derived(partnership.hospitality);
	const distanceLabel = $derived.by(() => {
		if (
			typeof originLat !== 'number' ||
			typeof originLng !== 'number' ||
			typeof hospitality.latitude !== 'number' ||
			typeof hospitality.longitude !== 'number'
		) {
			return null;
		}
		return formatDistance(
			distanceMeters(originLat, originLng, hospitality.latitude, hospitality.longitude)
		);
	});
	const benefit = $derived(partnership.benefit);
</script>

<li class="h-full">
	<Link
		href={UNPROTECTED_PAGE_ENDPOINTS.HOSPITALITY.replace(':id', hospitality._id)}
		class="group flex h-full flex-row overflow-hidden rounded-xl border border-border/80 bg-card text-foreground no-underline transition-[background-color,border-color,box-shadow] hover:border-primary/25 hover:no-underline hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:flex-col"
		onmouseenter={() => onHover?.(hospitality._id)}
		onmouseleave={() => onHover?.(null)}
		onfocus={() => onHover?.(hospitality._id)}
		onblur={() => onHover?.(null)}
	>
		<div
			class="relative aspect-square w-24 shrink-0 self-stretch overflow-hidden bg-muted sm:aspect-4/3 sm:w-full"
		>
			{#if hospitality.coverImageUrl}
				<img
					src={hospitality.coverImageUrl}
					alt=""
					class="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
					loading="lazy"
					decoding="async"
				/>
			{:else}
				<div class="flex size-full items-center justify-center text-muted-foreground">
					<StoreIcon class="size-8" aria-hidden="true" />
				</div>
			{/if}

			{#if benefit}
				<div class="absolute top-2 left-2">
					<Badge
						class="gap-1 bg-primary font-semibold text-primary-foreground shadow-sm [&_svg]:size-3.5"
					>
						<TagIcon aria-hidden="true" />
						{benefit}
					</Badge>
				</div>
			{/if}
		</div>

		<div class="flex min-w-0 flex-1 flex-col gap-1 p-3 text-left sm:p-4">
			<span class="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
				{labelHospitalityType(hospitality.type)}
			</span>

			<h3 class="mb-0 line-clamp-2 font-serif text-lg leading-snug font-medium">
				{hospitality.name}
			</h3>

			{#if distanceLabel}
				<span class="flex items-center gap-1 text-xs text-muted-foreground">
					<MapPinIcon class="size-3 shrink-0" aria-hidden="true" />
					{m['StayPage.StayPartnershipsSectionItem.distanceAway']({ distance: distanceLabel })}
				</span>
			{/if}

			<div class="mt-auto flex items-center justify-between gap-x-3 pt-3">
				<span class="min-w-0 truncate text-sm text-muted-foreground">{hospitality.city}</span>
				<span
					class="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5"
				>
					{m['StayPage.StayPartnershipsSectionItem.viewDetails']()}
					<ArrowRightIcon class="size-3.5" aria-hidden="true" />
				</span>
			</div>
		</div>
	</Link>
</li>
