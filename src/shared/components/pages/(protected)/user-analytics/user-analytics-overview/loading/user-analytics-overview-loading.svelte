<script lang="ts">
	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card/index.js';
</script>

<div class="flex flex-col gap-6 lg:gap-8">
	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
		{#each [...Array(4).keys()] as index (index)}
			<Card>
				<CardContent class="flex min-h-28 flex-col justify-between gap-4 p-4">
					<div>
						<Skeleton class="h-3 w-24" />
						<Skeleton class="mt-3 h-8 w-20" />
					</div>
					<Skeleton class="h-4 w-28" />
				</CardContent>
			</Card>
		{/each}
	</div>

	<Card>
		<CardHeader>
			<Skeleton class="h-5 w-32" />
			<Skeleton class="h-4 w-48" />
		</CardHeader>
		<CardContent class="px-2 pb-4 sm:px-4">
			<Skeleton class="h-72 w-full rounded-lg" />
		</CardContent>
	</Card>

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
