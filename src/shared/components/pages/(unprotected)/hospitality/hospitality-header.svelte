<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Carousel from '@/shared/components/ui/carousel/index.js';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { CarouselAPI } from '@/shared/components/ui/carousel/context.js';
	import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// LUCIDE ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	let { hospitality }: { hospitality: HospitalityDetailsSafe } = $props();

	const images = $derived(hospitality.images ?? []);

	let api = $state<CarouselAPI>();
	let current = $state(0);

	$effect(() => {
		if (!api) return;
		const sync = () => (current = api!.selectedScrollSnap());
		sync();
		api.on('select', sync);
		return () => void api?.off('select', sync);
	});
</script>

<div class="lg:px-8 lg:pt-6">
	<Carousel.Root
		setApi={(next) => (api = next)}
		opts={{ loop: true }}
		class="lg:mx-auto lg:max-w-7xl"
	>
		<div class="relative w-full overflow-hidden bg-muted lg:rounded-2xl">
			<Carousel.Content class="ms-0">
				{#each images as image (image.key)}
					<Carousel.Item class="ps-0">
						<div
							class="relative aspect-16/10 max-h-[min(70vh,32rem)] w-full max-lg:max-h-[min(52vh,24rem)]"
						>
							<img
								src={image.url}
								alt=""
								class="absolute inset-0 size-full object-cover"
								decoding="async"
								fetchpriority={image.key === images[0]?.key ? 'high' : 'auto'}
							/>
						</div>
					</Carousel.Item>
				{:else}
					<Carousel.Item class="ps-0">
						<div
							class="aspect-16/10 max-h-[min(70vh,32rem)] w-full max-lg:max-h-[min(52vh,24rem)]"
						></div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>

			<div
				class="pointer-events-none absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent"
				aria-hidden="true"
			></div>

			<div class="pointer-events-none absolute inset-x-0 bottom-0 px-4 pt-24 pb-8 sm:px-8 sm:pb-10">
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

		{#if images.length > 1}
			<div class="mt-3 flex items-center gap-3 px-4 lg:px-0">
				<Carousel.Previous class="static my-0 shrink-0" />

				<div class="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
					{#each images as image, index (image.key)}
						<button
							type="button"
							onclick={() => api?.scrollTo(index)}
							aria-label={m['HospitalityPage.HospitalityHeader.thumbnailLabel']({
								index: index + 1,
								total: images.length
							})}
							aria-current={index === current}
							class="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity sm:h-16 sm:w-24 {index ===
							current
								? 'border-primary'
								: 'border-transparent opacity-60 hover:opacity-100'}"
						>
							<img src={image.url} alt="" class="size-full object-cover" loading="lazy" />
						</button>
					{/each}
				</div>

				<Carousel.Next class="static my-0 shrink-0" />
			</div>
		{/if}
	</Carousel.Root>
</div>
