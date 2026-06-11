<script lang="ts">
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	{#each [...Array(4).keys()] as index (index)}
		<Card>
			<CardContent class="flex min-h-28 flex-col justify-between gap-4 p-4">
				<div>
					<Skeleton class="h-3 w-24" />
					<Skeleton class="mt-3 h-8 w-20" />
				</div>
				<Skeleton class="h-6 w-16 rounded-full" />
			</CardContent>
		</Card>
	{/each}
</div>

<Card>
	<CardHeader>
		<CardTitle>Venues by reservation requests</CardTitle>
		<CardDescription>Which hospitalities convert guest discovery into demand.</CardDescription>
	</CardHeader>
	<CardContent class="px-2 pb-4 sm:px-4">
		<Skeleton class="h-80 w-full rounded-lg" />
	</CardContent>
</Card>

<Card>
	<CardHeader>
		<CardTitle class="text-base">Hospitality performance</CardTitle>
		<CardDescription
			>Use this to find strong venues and quiet guest discovery paths.</CardDescription
		>
	</CardHeader>
	<CardContent class="space-y-3">
		{#each [...Array(5).keys()] as index (index)}
			<Skeleton class="h-12 w-full rounded-md" />
		{/each}
	</CardContent>
</Card>
