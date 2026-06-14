<script lang="ts">
	// COMPONENTS
	import FeatureFourLeftSide from './feature-four-left-side.svelte';
	import FeatureFourRightSide from './feature-four-right-side.svelte';
</script>

<div class="grid gap-12 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] lg:items-start">
	<div class="lg:pt-10">
		<FeatureFourLeftSide />
	</div>

	<FeatureFourRightSide />
</div>
