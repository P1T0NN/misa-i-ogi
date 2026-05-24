<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<div class="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
	<Skeleton class="aspect-2/1 w-full rounded-2xl" />

	<div class="flex flex-col gap-2">
		<Skeleton class="h-3 w-20" />
		<Skeleton class="h-8 max-w-xs" />
		<Skeleton class="h-4 max-w-sm" />
	</div>

	{#each { length: 3 } as _, i (i)}
		<div class="border-border/80 rounded-xl border p-4">
			<div class="flex gap-3">
				<Skeleton class="size-20 shrink-0 rounded-lg" />
				<div class="flex flex-1 flex-col gap-2">
					<Skeleton class="h-3 w-24" />
					<Skeleton class="h-5 max-w-[12rem]" />
					<Skeleton class="h-4 w-full" />
				</div>
			</div>
		</div>
	{/each}
</div>

<p class="sr-only" aria-live="polite">{m['ScanPage.ScanLoading.announce']()}</p>
