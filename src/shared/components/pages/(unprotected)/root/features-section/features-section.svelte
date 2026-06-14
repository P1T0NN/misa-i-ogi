<script lang="ts">
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
	<FeatureOne />

	<div class="mt-24 border-t border-border-2 pt-32 sm:mt-28 sm:pt-36">
		<FeatureTwo />
	</div>

	<div class="mt-24 border-t border-border-2 pt-32 sm:mt-28 sm:pt-36">
		<FeatureThree />
	</div>

	<div class="mt-24 border-t border-border-2 pt-32 sm:mt-28 sm:pt-36">
		<FeatureFour />
	</div>
</Section>
