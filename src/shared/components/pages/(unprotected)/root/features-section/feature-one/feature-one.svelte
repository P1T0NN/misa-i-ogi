<script lang="ts">
	// COMPONENTS
	import FeatureOneLeftSide from './feature-one-left-side.svelte';
	import FeatureOneRightSide from './feature-one-right-side.svelte';
</script>

<div class="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
	<FeatureOneLeftSide />

	<div class="min-w-0 lg:pt-10">
		<FeatureOneRightSide />
	</div>
</div>
