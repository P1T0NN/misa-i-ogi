<script lang="ts">
	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card/index.js';
</script>

<div class="flex flex-col gap-6 lg:gap-8">
	{#each [...Array(3).keys()] as index (index)}
		<Card>
			<CardHeader>
				<Skeleton class="h-5 w-32" />
				<Skeleton class="h-4 w-48" />
			</CardHeader>
			<CardContent class="px-2 pb-4 sm:px-4">
				<Skeleton class="h-72 w-full rounded-lg" />
			</CardContent>
		</Card>
	{/each}

	{#each [...Array(2).keys()] as index (index)}
		<Card>
			<CardHeader class="gap-1.5">
				<Skeleton class="h-5 w-40" />
				<Skeleton class="h-4 w-56" />
			</CardHeader>
			<CardContent class="space-y-3">
				{#each [...Array(4).keys()] as rowIndex (rowIndex)}
					<Skeleton class="h-12 w-full rounded-md" />
				{/each}
			</CardContent>
		</Card>
	{/each}
</div>
