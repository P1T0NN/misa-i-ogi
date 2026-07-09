<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<p class="sr-only" aria-live="polite">{m['StayPage.StayPartnershipsLoading.announce']()}</p>
<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 2xl:grid-cols-3">
	{#each [0, 1, 2] as row (row)}
		<div
			class="flex flex-row overflow-hidden rounded-xl border border-border/80 bg-card sm:flex-col"
		>
			<Skeleton
				class="aspect-square w-24 shrink-0 self-stretch rounded-none sm:aspect-4/3 sm:w-full"
			/>
			<div class="flex flex-1 flex-col gap-2 p-3 sm:p-4">
				<Skeleton class="h-3 w-20" />
				<Skeleton class="h-6 max-w-40" />
				<div class="mt-1 flex items-center justify-between gap-3">
					<Skeleton class="h-4 w-16" />
					<Skeleton class="h-4 w-20" />
				</div>
			</div>
		</div>
	{/each}
</div>
