<script lang="ts">
	// COMPONENTS
	import FeatureTwoLeftSide from './feature-two-left-side.svelte';
	import FeatureTwoRightSide from './feature-two-right-side.svelte';
</script>

<div class="grid gap-12 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] lg:items-start">
	<div class="lg:pt-10">
		<FeatureTwoLeftSide />
	</div>

	<FeatureTwoRightSide />
</div>
