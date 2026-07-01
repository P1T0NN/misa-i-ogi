<script lang="ts">
	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import { ArrowRight } from '@lucide/svelte';
</script>

<section
	class="relative isolate min-h-[88svh] overflow-hidden bg-dark text-ivory"
	aria-labelledby="home-hero-heading"
>
	<img
		src="/images/landing/hero-image.png"
		alt="Warm accommodation room with a blank welcome card on a bedside table"
		class="absolute inset-0 -z-20 size-full object-cover object-[70%_50%] sm:object-center"
		width="1680"
		height="945"
		decoding="async"
		fetchpriority="high"
	/>

	<div
		class="absolute inset-0 -z-10 bg-linear-to-r from-dark/90 via-dark/70 to-dark/20"
		aria-hidden="true"
	></div>
	<!-- Mobile-only vertical scrim: keeps the headline and CTAs legible over the photo on phones. -->
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-dark/80 via-dark/30 to-transparent sm:hidden"
		aria-hidden="true"
	></div>
	<div
		class="absolute inset-x-0 bottom-0 -z-10 h-56 bg-linear-to-t from-background to-transparent"
		aria-hidden="true"
	></div>

	<div
		class="mx-auto grid min-h-[88svh] w-full max-w-7xl items-center gap-10 px-4 pt-24 pb-16 sm:items-end sm:px-6 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-8 lg:pb-20 xl:grid-cols-[minmax(0,1fr)_28rem]"
	>
		<div class="max-w-3xl pb-8 text-center sm:text-left">
			<h1
				id="home-hero-heading"
				class="reveal reveal-2 mx-auto mt-5 max-w-[13ch] font-display text-5xl leading-[0.96] font-medium tracking-normal text-balance text-ivory sm:mx-0 sm:text-6xl md:text-7xl xl:text-8xl"
			>
				The best local places, the moment guests arrive.
			</h1>

			<p
				class="reveal reveal-3 mx-auto mt-7 max-w-[58ch] text-lg leading-relaxed text-silver sm:mx-0 sm:text-xl"
			>
				Guests scan one QR code in the room, unlock curated local benefits, and request reservations
				from partner hospitalities. Accommodations join free. Hospitality partners receive guests
				who are already minutes away.
			</p>

			<div
				class="reveal reveal-4 mt-9 flex flex-wrap items-center justify-center gap-3 sm:justify-start"
			>
				<Button
					href={UNPROTECTED_PAGE_ENDPOINTS.SIGNUP}
					size="lg"
					class="h-11 gap-2 bg-primary px-5 text-button text-primary-foreground hover:bg-primary/90"
				>
					Register free
					<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
				</Button>

				<Button
					href={UNPROTECTED_PAGE_ENDPOINTS.CONTACT}
					variant="outline"
					size="lg"
					class="h-11 border-ivory/30 bg-ivory/10 px-5 text-button text-ivory hover:bg-ivory/20 hover:text-ivory"
				>
					Contact us
				</Button>
			</div>
		</div>
	</div>
</section>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.reveal {
			opacity: 0;
			animation: reveal-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		}

		.reveal-2 {
			animation-delay: 0.12s;
		}

		.reveal-3 {
			animation-delay: 0.2s;
		}

		.reveal-4 {
			animation-delay: 0.28s;
		}
	}

	@keyframes reveal-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
