<script lang="ts">
	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';

	const skeletonRows = [0, 1, 2, 3, 4];
</script>

<ul class="flex flex-col gap-0.5 px-1 py-1" aria-hidden="true">
	{#each skeletonRows as row (row)}
		<li class="flex flex-col gap-1.5 rounded-lg px-3 py-2.5">
			<Skeleton class="h-4 w-40 max-w-full" />
			<Skeleton class="h-3 w-24 max-w-full" />
		</li>
	{/each}
</ul>
