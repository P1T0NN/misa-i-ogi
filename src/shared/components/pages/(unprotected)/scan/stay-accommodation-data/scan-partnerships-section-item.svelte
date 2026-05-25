<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import StoreIcon from '@lucide/svelte/icons/store';

	let { partnership }: { partnership: AccommodationPartnershipSafe } = $props();

	const hospitality = $derived(partnership.hospitality);
</script>

<li>
	<Link
		href={UNPROTECTED_PAGE_ENDPOINTS.HOSPITALITY.replace(':id', hospitality._id)}
		class="group flex gap-3 rounded-xl border border-border/80 bg-card p-3 text-foreground no-underline transition-[background-color,border-color,box-shadow] hover:border-primary/25 hover:bg-accent/40 hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-4 sm:p-4"
	>
		<div class="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
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
					<StoreIcon class="size-6" aria-hidden="true" />
				</div>
			{/if}
		</div>

		<div class="flex min-w-0 flex-1 flex-col gap-1 text-left">
			<span class="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
				{labelHospitalityType(hospitality.type)}
			</span>

			<h3 class="mb-0 line-clamp-2 font-serif text-lg leading-snug font-medium">
				{hospitality.name}
			</h3>

			<div class="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2">
				{#if partnership.discountPercentage != null}
					<Badge variant="secondary" class="bg-accent text-primary">
						{partnership.discountPercentage}% {m['ScanPage.perkOff']()}
					</Badge>
				{:else}
					<span class="text-sm text-muted-foreground">{hospitality.city}</span>
				{/if}

				<span
					class="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary"
				>
					{m['ScanPage.perkViewDetails']()}
					<ArrowRightIcon class="size-3.5" aria-hidden="true" />
				</span>
			</div>
		</div>
	</Link>
</li>
