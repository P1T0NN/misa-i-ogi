<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import Link from '@/shared/components/ui/link/link.svelte';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { AccommodationPartnershipSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	let { partnership }: { partnership: AccommodationPartnershipSafe } = $props();

	const hospitality = $derived(partnership.hospitality);
</script>

<li>
	<Link
		href={UNPROTECTED_PAGE_ENDPOINTS.HOSPITALITY.replace(':id', hospitality._id)}
		class="flex gap-3 rounded-xl border border-border/80 bg-card p-4 transition-colors hover:bg-muted/40"
	>
		<div class="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
			{#if hospitality.coverImageUrl}
				<img
					src={hospitality.coverImageUrl}
					alt=""
					class="absolute inset-0 size-full object-cover"
					loading="lazy"
					decoding="async"
				/>
			{/if}
		</div>

		<div class="flex min-w-0 flex-1 flex-col gap-1 text-left">
			<p class="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
				{labelHospitalityType(hospitality.type)}
			</p>

			<p class="font-serif text-lg leading-snug font-medium">
				{hospitality.name}
			</p>

			<p class="text-sm text-muted-foreground">
				{hospitality.city}

				{#if partnership.discountPercentage != null}
					· {partnership.discountPercentage}%
					{m['ScanPage.perkOff']()}
				{/if}
			</p>
		</div>
	</Link>
</li>
