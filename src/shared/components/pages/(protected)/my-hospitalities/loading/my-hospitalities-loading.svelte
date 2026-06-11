<script lang="ts">
	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';

	const skeletonKeys = [...Array(5).keys()];
</script>

<div class="flex flex-col gap-2">
	{#each skeletonKeys as index (index)}
		<div class="rounded-xl border border-border bg-card px-3 py-3 md:px-4">
			<div class="grid gap-3 md:grid-cols-[4.5rem_minmax(0,1fr)_auto] md:items-center">
				<Skeleton class="size-16 rounded-lg md:size-18" />
				<div class="space-y-2">
					<Skeleton class="h-4 w-52 max-w-full" />
					<div class="flex flex-wrap gap-2">
						<Skeleton class="h-3 w-28" />
						<Skeleton class="h-5 w-24" />
						<Skeleton class="h-5 w-28" />
					</div>
				</div>
				<div class="flex gap-2">
					<Skeleton class="h-9 w-20" />
					<Skeleton class="size-9" />
				</div>
			</div>
		</div>
	{/each}
</div>
