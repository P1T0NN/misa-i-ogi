<script lang="ts">
	// COMPONENTS
	import FeatureThreeLeftSide from './feature-three-left-side.svelte';
	import FeatureThreeRightSide from './feature-three-right-side.svelte';
</script>

<div class="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
	<FeatureThreeLeftSide />

	<div class="lg:pt-10">
		<FeatureThreeRightSide />
	</div>
</div>
