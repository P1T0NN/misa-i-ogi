<script lang="ts">
	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import PricingSectionAccommodations from './pricing-section-accommodations.svelte';
	import PricingSectionHospitalities from './pricing-section-hospitalities.svelte';
</script>

<Section
	id="pricing"
	yPadding="xl"
	class="border-y border-border-2 bg-muted"
	ariaLabelledby="pricing-heading"
>
	<div class="mx-auto max-w-2xl text-center">
		<p class="landing-section-eyebrow text-primary">What it costs</p>

		<h2
			id="pricing-heading"
			class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
		>
			Almost all of it is free.
		</h2>

		<p class="lead mx-auto mt-5 max-w-[52ch]">
			No card to sign up, no monthly bill to use it. You only pay if you choose extras — and even
			then, only in the way that fits your side.
		</p>
	</div>

	<div class="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-8">
		<PricingSectionAccommodations />

		<PricingSectionHospitalities />
	</div>

	<p class="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
		No credit card to start. You upgrade only if — and when — it actually helps you.
	</p>
</Section>
