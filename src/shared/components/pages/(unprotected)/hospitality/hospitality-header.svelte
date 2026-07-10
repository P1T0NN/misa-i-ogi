<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// LUCIDE ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	let { hospitality }: { hospitality: HospitalityDetailsSafe } = $props();
</script>

<div class="lg:px-8 lg:pt-6">
	<div class="relative w-full overflow-hidden bg-muted lg:mx-auto lg:max-w-7xl lg:rounded-2xl">
		<div
			class="relative aspect-16/10 max-h-[min(70vh,32rem)] w-full max-lg:max-h-[min(52vh,24rem)]"
		>
			<img
				src={hospitality.images?.[0]?.url}
				alt=""
				class="absolute inset-0 size-full object-cover"
				decoding="async"
				fetchpriority="high"
			/>

			<div
				class="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent"
				aria-hidden="true"
			></div>

			<div class="absolute inset-x-0 bottom-0 px-4 pt-24 pb-8 sm:px-8 sm:pb-10">
				<p class="mb-2 font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
					{labelHospitalityType(hospitality.type)}
				</p>

				<h1
					class="font-serif text-3xl leading-[1.1] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl"
				>
					{hospitality.name}
				</h1>

				<p class="mt-3 flex items-start gap-2 text-sm text-muted-foreground sm:text-base">
					<MapPinIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />

					<span>
						{m['HospitalityPage.HospitalityLocation.addressLineMeta']({
							address: hospitality.address,
							city: hospitality.city,
							country: hospitality.country
						})}
					</span>
				</p>
			</div>
		</div>
	</div>
</div>
