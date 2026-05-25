<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<div class="pb-10 sm:pb-12 lg:pb-16">
	<Skeleton
		class="aspect-4/3 w-full rounded-none sm:aspect-2/1 lg:mx-auto lg:mt-5 lg:max-w-7xl lg:rounded-2xl"
	/>

	<div
		class="mx-auto grid w-full max-w-7xl gap-8 px-3 pt-5 sm:px-4 sm:pt-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-x-12 lg:gap-y-9 lg:px-8 lg:pt-9"
	>
		<div class="flex flex-col gap-3 border-b border-border/80 pb-6 sm:pb-8">
			<Skeleton class="h-3 w-24" />
			<Skeleton class="h-9 w-full max-w-sm" />
			<Skeleton class="h-5 w-full max-w-md" />
			<Skeleton class="mt-2 h-4 w-full max-w-xl" />
		</div>

		<div
			class="rounded-xl border border-border/80 p-4 sm:p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1"
		>
			<Skeleton class="mb-3 h-3 w-24" />
			<Skeleton class="mb-3 h-6 w-full max-w-56" />
			<Skeleton class="mb-4 h-4 w-full" />
			<Skeleton class="mb-3 h-11 w-full rounded-lg" />
			<Skeleton class="h-3 w-4/5" />
		</div>

		<div class="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
			<div class="flex flex-col gap-2">
				<Skeleton class="h-3 w-32" />
				<Skeleton class="h-8 w-full max-w-xs" />
				<Skeleton class="h-4 w-full max-w-md" />
			</div>

			{#each [0, 1, 2] as row (row)}
				<div class="rounded-xl border border-border/80 p-3 sm:p-4">
					<div class="flex gap-3">
						<Skeleton class="size-24 shrink-0 rounded-lg" />
						<div class="flex flex-1 flex-col gap-2">
							<Skeleton class="h-3 w-24" />
							<Skeleton class="h-6 max-w-[12rem]" />
							<Skeleton class="mt-auto h-5 w-16 rounded-full" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<p class="sr-only" aria-live="polite">{m['ScanPage.ScanLoading.announce']()}</p>
