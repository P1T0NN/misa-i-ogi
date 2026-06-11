<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	let { pendingCount = 0 }: { pendingCount?: number } = $props();
</script>

<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
	<div class="flex max-w-3xl flex-col gap-2">
		<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Reservations</h1>

		<p class="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
			Manage incoming guest requests across your hospitalities — accept, decline, and track every
			booking.
		</p>
	</div>

	{#if pendingCount > 0}
		<Badge variant="default" class="self-start lg:self-end">
			{pendingCount} pending
		</Badge>
	{/if}
</header>
