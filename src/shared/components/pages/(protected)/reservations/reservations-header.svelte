<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	let { pendingCount = 0 }: { pendingCount?: number } = $props();
</script>

<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
	<div class="flex max-w-3xl flex-col gap-2">
		<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
			{m['ReservationsPage.ReservationsHeader.title']()}
		</h1>

		<p class="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
			{m['ReservationsPage.ReservationsHeader.description']()}
		</p>
	</div>

	{#if pendingCount > 0}
		<Badge variant="default" class="self-start lg:self-end">
			{m['ReservationsPage.ReservationsHeader.pendingBadge']({ count: pendingCount })}
		</Badge>
	{/if}
</header>
