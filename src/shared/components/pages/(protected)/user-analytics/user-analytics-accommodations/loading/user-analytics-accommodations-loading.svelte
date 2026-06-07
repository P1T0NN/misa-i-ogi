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
	{#each Array.from({ length: 4 }) as _, index (index)}
		<Card class="py-0">
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

<Card class="py-0">
	<CardHeader>
		<CardTitle>Stays by reservation requests</CardTitle>
		<CardDescription>Which accommodations create the most hospitality demand.</CardDescription>
	</CardHeader>
	<CardContent class="px-2 pb-4 sm:px-4">
		<Skeleton class="h-80 w-full rounded-lg" />
	</CardContent>
</Card>

<Card class="py-0">
	<CardHeader>
		<CardTitle class="text-base">Accommodation performance</CardTitle>
		<CardDescription>Use this to find strong stays and quiet QR placements.</CardDescription>
	</CardHeader>
	<CardContent class="space-y-3">
		{#each Array.from({ length: 5 }) as _, index (index)}
			<Skeleton class="h-12 w-full rounded-md" />
		{/each}
	</CardContent>
</Card>
