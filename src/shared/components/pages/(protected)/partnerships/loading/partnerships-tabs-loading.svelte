<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';

	const skeletonRows = [0, 1, 2];
</script>

<div
	class="flex flex-col gap-2"
	aria-label={m['PartnershipsPage.PartnershipsTabsLoading.ariaLabel']()}
>
	{#each skeletonRows as row (row)}
		<div class="rounded-lg border border-border bg-background/70 p-4">
			<Skeleton class="h-4 w-48 max-w-full" />
			<Skeleton class="mt-2 h-3 w-36 max-w-full" />
		</div>
	{/each}
</div>
