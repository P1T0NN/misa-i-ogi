<script lang="ts">
	// COMPONENTS
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';

	const skeletonRows = [0, 1, 2];
</script>

<div class="grid gap-3" aria-label="Loading reservations">
	{#each skeletonRows as row (row)}
		<Card>
			<CardContent class="p-4">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div class="flex min-w-0 items-start gap-3">
						<Skeleton class="size-9 shrink-0 rounded-full" />

						<div class="min-w-0 flex-1 space-y-2">
							<div class="flex flex-wrap items-center gap-2">
								<Skeleton class="h-4 w-44 max-w-full" />
								<Skeleton class="h-5 w-20 rounded-4xl" />
							</div>

							<div class="flex flex-wrap items-center gap-2">
								<Skeleton class="h-3 w-20" />
								<Skeleton class="h-3 w-28" />
								<Skeleton class="h-3 w-16" />
							</div>
						</div>
					</div>

					<div class="flex items-center gap-2 self-end sm:self-center">
						<Skeleton class="h-8 w-20 rounded-md" />
						<Skeleton class="h-8 w-20 rounded-md" />
					</div>
				</div>

				<Skeleton class="mt-4 h-px w-full" />

				<div class="mt-3 flex flex-wrap items-center gap-3">
					<Skeleton class="h-3 w-40" />
					<Skeleton class="h-3 w-32" />
					<Skeleton class="ml-auto h-3 w-28" />
				</div>
			</CardContent>
		</Card>
	{/each}
</div>
