<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import FeatureOne from './feature-one/feature-one.svelte';
	import FeatureTwo from './feature-two/feature-two.svelte';
	import FeatureThree from './feature-three/feature-three.svelte';
	import FeatureFour from './feature-four/feature-four.svelte';
</script>

<Section
	id="owner-features"
	yPadding="xl"
	class="overflow-hidden border-y border-border-2 bg-background"
	ariaLabelledby="owner-features-heading"
>
	<div class="mx-auto max-w-2xl text-center">
		<p class="landing-section-eyebrow text-primary">{m['HomePage.FeaturesSection.eyebrow']()}</p>

		<h2
			id="owner-features-heading"
			class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl lg:text-6xl"
		>
			{m['HomePage.FeaturesSection.heading']()}
		</h2>

		<p class="lead mx-auto mt-5 max-w-[54ch]">
			{m['HomePage.FeaturesSection.lead']()}
		</p>
	</div>

	<div class="mt-16 sm:mt-20">
		<FeatureFour />
	</div>

	<div class="mt-24 border-t border-border-2 pt-32 sm:mt-28 sm:pt-36">
		<FeatureThree />
	</div>

	<div class="mt-24 border-t border-border-2 pt-32 sm:mt-28 sm:pt-36">
		<FeatureTwo />
	</div>

	<div class="mt-24 border-t border-border-2 pt-32 sm:mt-28 sm:pt-36">
		<FeatureOne />
	</div>
</Section>
