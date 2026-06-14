<script lang="ts" generics="Item">
	// LIBRARIES
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils';

	// TYPES
	import type { Snippet } from 'svelte';

	type Props = {
		items: Item[];
		children: Snippet<[item: Item, index: number]>;
		class?: string;
		viewportClass?: string;
		trackClass?: string;
		slideClass?: string;
		footerClass?: string;
		ariaLabel?: string;
		previousLabel?: string;
		nextLabel?: string;
		showControls?: boolean;
		showDots?: boolean;
		loop?: boolean;
		getKey?: (item: Item, index: number) => string | number;
		getDotLabel?: (item: Item, index: number) => string;
	};

	let {
		items,
		children,
		class: className,
		viewportClass,
		trackClass,
		slideClass,
		footerClass,
		ariaLabel = 'Carousel',
		previousLabel = 'Previous slide',
		nextLabel = 'Next slide',
		showControls = true,
		showDots = true,
		loop = false,
		getKey,
		getDotLabel = (_item: Item, index: number) => `Go to slide ${index + 1}`
	}: Props = $props();

	let viewport = $state<HTMLDivElement>();
	let track = $state<HTMLDivElement>();
	let activeIndex = $state(0);
	let scrollFrame = 0;

	const lastIndex = $derived(Math.max(items.length - 1, 0));
	const currentIndex = $derived(items.length === 0 ? 0 : Math.min(activeIndex, lastIndex));
	const hasMultipleItems = $derived(items.length > 1);
	const canMovePrevious = $derived(loop ? hasMultipleItems : currentIndex > 0);
	const canMoveNext = $derived(loop ? hasMultipleItems : currentIndex < lastIndex);

	function normalizeIndex(index: number) {
		if (items.length === 0) return 0;
		if (!loop) return Math.min(Math.max(index, 0), lastIndex);

		return (index + items.length) % items.length;
	}

	function getScrollBehavior(): ScrollBehavior {
		if (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return 'auto';
		}

		return 'smooth';
	}

	function scrollToSlide(index: number) {
		const nextIndex = normalizeIndex(index);
		const slide = track?.children.item(nextIndex) as HTMLElement | null;
		activeIndex = nextIndex;
		slide?.scrollIntoView({
			behavior: getScrollBehavior(),
			block: 'nearest',
			inline: 'start'
		});
	}

	function updateActiveIndexFromScroll() {
		if (!viewport || !track || items.length === 0) return;

		const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
		let nearestIndex = 0;
		let nearestDistance = Number.POSITIVE_INFINITY;

		Array.from(track.children).forEach((child, index) => {
			const slide = child as HTMLElement;
			const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
			const distance = Math.abs(slideCenter - viewportCenter);

			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = index;
			}
		});

		activeIndex = nearestIndex;
	}

	function scheduleActiveIndexUpdate() {
		if (typeof window === 'undefined') return;
		window.cancelAnimationFrame(scrollFrame);
		scrollFrame = window.requestAnimationFrame(updateActiveIndexFromScroll);
	}

	function attachViewport(node: HTMLDivElement) {
		viewport = node;

		return {
			destroy() {
				if (viewport === node) {
					viewport = undefined;
				}
			}
		};
	}

	function attachTrack(node: HTMLDivElement) {
		track = node;

		return {
			destroy() {
				if (track === node) {
					track = undefined;
				}
			}
		};
	}
</script>

<div
	class={cn('custom-carousel w-full min-w-0', className)}
	role="region"
	aria-roledescription="carousel"
	aria-label={ariaLabel}
>
	{#if items.length > 0}
		<div
			use:attachViewport
			class={cn(
				'custom-carousel-viewport w-full max-w-full min-w-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
				viewportClass
			)}
			onscroll={scheduleActiveIndexUpdate}
		>
			<div use:attachTrack class={cn('flex w-full max-w-full min-w-0', trackClass)}>
				{#each items as item, index (getKey?.(item, index) ?? index)}
					<div
						class={cn(
							'w-full max-w-full min-w-0 flex-[0_0_100%] snap-start snap-always overflow-hidden',
							slideClass
						)}
						role="group"
						aria-roledescription="slide"
						aria-label={`${index + 1} / ${items.length}`}
					>
						{@render children(item, index)}
					</div>
				{/each}
			</div>
		</div>

		{#if hasMultipleItems && (showDots || showControls)}
			<div
				class={cn('mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3', footerClass)}
			>
				<div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-3">
					<span class="font-mono text-xs tracking-caps text-muted-foreground">
						{currentIndex + 1} / {items.length}
					</span>

					{#if showDots}
						<div class="flex flex-wrap items-center gap-2" aria-label={ariaLabel}>
							{#each items as item, index (getKey?.(item, index) ?? index)}
								<button
									type="button"
									class={cn(
										'h-2 rounded-full transition-all duration-200 ease-out',
										index === currentIndex
											? 'w-8 bg-primary'
											: 'w-2 bg-muted-foreground/35 hover:bg-muted-foreground/60'
									)}
									aria-label={getDotLabel(item, index)}
									aria-current={index === currentIndex ? 'step' : undefined}
									onclick={() => scrollToSlide(index)}
								></button>
							{/each}
						</div>
					{/if}
				</div>

				{#if showControls}
					<div class="ml-auto flex shrink-0 items-center gap-2">
						<button
							type="button"
							class="grid size-10 place-items-center rounded-full border border-border-2 bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-35"
							aria-label={previousLabel}
							disabled={!canMovePrevious}
							onclick={() => scrollToSlide(currentIndex - 1)}
						>
							<ChevronLeft class="size-4" aria-hidden="true" />
						</button>
						<button
							type="button"
							class="grid size-10 place-items-center rounded-full border border-border-2 bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-35"
							aria-label={nextLabel}
							disabled={!canMoveNext}
							onclick={() => scrollToSlide(currentIndex + 1)}
						>
							<ChevronRight class="size-4" aria-hidden="true" />
						</button>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.custom-carousel-viewport {
		scrollbar-width: none;
	}

	.custom-carousel-viewport::-webkit-scrollbar {
		display: none;
	}
</style>
