<script lang="ts">
	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
	{#each { length: 5 }, index (index)}
		<Card.Root class="py-0">
			<Card.Content class="space-y-4 p-4">
				<Skeleton class="h-4 w-24" />
				<Skeleton class="h-8 w-16" />
				<Skeleton class="h-4 w-full" />
			</Card.Content>
		</Card.Root>
	{/each}
</div>
