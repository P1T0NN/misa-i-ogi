<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import TestimonialsSectionTop from './testimonials-section-top.svelte';
	import TestimonialsSectionBottom from './testimonials-section-bottom.svelte';
</script>

<Section
	id="testimonials"
	surface="background"
	yPadding="lg"
	contain={false}
	ariaLabelledby="testimonials-heading"
>
	<div class="mb-12 flex w-full flex-col items-center justify-center gap-2 px-6">
		<div class="mb-2 flex items-center gap-3">
			<div class="h-px w-8 bg-primary"></div>
			<span class="font-body text-xs tracking-[0.2em] text-primary uppercase">
				{m['TestimonialsSection.UpDownAnimation.socialProof']()}
			</span>
		</div>

		<h3
			id="testimonials-heading"
			class="text-center font-display text-4xl leading-none tracking-wide text-foreground sm:text-5xl md:text-6xl"
		>
			{m['TestimonialsSection.UpDownAnimation.seeWhyClientsKeepComingBack']()}
		</h3>
	</div>

	<div class="flex flex-col gap-3">
		<TestimonialsSectionTop />
		<TestimonialsSectionBottom />
	</div>
</Section>
