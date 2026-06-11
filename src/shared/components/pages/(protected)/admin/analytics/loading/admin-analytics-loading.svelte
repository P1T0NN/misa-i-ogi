<script lang="ts">
	// COMPONENTS
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card/index.js';
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<div class="flex flex-col gap-6 lg:gap-8" aria-busy="true" aria-label="Loading platform analytics">
	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
		{#each { length: 5 }, index (index)}
			<Card class="py-0">
				<CardContent class="flex min-h-28 flex-col justify-between gap-4 p-4">
					<div class="space-y-2">
						<Skeleton class="h-3 w-24" />
						<Skeleton class="h-8 w-16" />
					</div>
					<Skeleton class="h-5 w-20 rounded-full" />
				</CardContent>
			</Card>
		{/each}
	</div>

	<Card class="py-0">
		<CardHeader class="gap-1.5">
			<Skeleton class="h-5 w-36" />
			<Skeleton class="h-4 w-80 max-w-full" />
		</CardHeader>
		<CardContent class="px-2 pb-4 sm:px-4">
			<Skeleton class="aspect-auto h-96 w-full rounded-lg" />
		</CardContent>
	</Card>

	<div class="grid gap-6 xl:grid-cols-2">
		{#each { length: 2 }, index (index)}
			<section
				class="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 md:p-5"
			>
				<div class="space-y-2">
					<Skeleton class="h-5 w-44" />
					<Skeleton class="h-4 w-full max-w-md" />
				</div>

				<div class="space-y-2">
					<Skeleton class="h-9 w-full rounded-md" />
					{#each { length: 5 }, rowIndex (rowIndex)}
						<Skeleton class="h-12 w-full rounded-md" />
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>
