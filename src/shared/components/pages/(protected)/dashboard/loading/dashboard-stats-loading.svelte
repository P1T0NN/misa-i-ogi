<script lang="ts">
	// COMPONENTS
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	{#each { length: 4 }}
		<Card class="py-0">
			<CardContent class="flex items-start justify-between gap-4 p-4">
				<div class="min-w-0 flex-1">
					<Skeleton class="mb-2 h-3 w-16" />
					<Skeleton class="mb-1.5 h-7 w-12" />
					<Skeleton class="h-3 w-28" />
				</div>
				<Skeleton class="size-8 rounded-md" />
			</CardContent>
		</Card>
	{/each}
</div>
