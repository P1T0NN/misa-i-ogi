<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
</script>

<p class="sr-only" aria-live="polite">{m['StayPage.StayPartnershipsLoading.announce']()}</p>
<div class="flex flex-col gap-3">
	{#each [0, 1, 2] as row (row)}
		<div class="flex gap-3 rounded-xl border border-border/80 bg-card p-3 sm:p-4">
			<Skeleton class="size-24 shrink-0 rounded-lg" />
			<div class="flex flex-1 flex-col gap-2 py-1">
				<Skeleton class="h-3 w-20" />
				<Skeleton class="h-6 max-w-48" />
				<div class="mt-auto flex items-center justify-between gap-3">
					<Skeleton class="h-5 w-16 rounded-full" />
					<Skeleton class="h-4 w-20" />
				</div>
			</div>
		</div>
	{/each}
</div>
