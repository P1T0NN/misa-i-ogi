<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import Spinner from '@/shared/components/ui/spinner/spinner.svelte';

	// TYPES
	import type { MyAccommodationsSummary } from '@/convex/tables/accommodations/types/accommodationsTypes';

	// LUCIDE ICONS
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import Link2Icon from '@lucide/svelte/icons/link-2';

	let {
		isLoading,
		hasError,
		summary
	}: {
		isLoading: boolean;
		hasError: boolean;
		summary: MyAccommodationsSummary | undefined;
	} = $props();

	const totalCount = $derived(summary?.totalCount ?? 0);

	const overviewItems = $derived([
		{
			id: 'active-stays',
			label: m['MyAccommodationsPage.MyAccommodationsHeader.activeStays'](),
			value: summary?.activeCount ?? 0,
			icon: Building2Icon
		},
		{
			id: 'partnerships',
			label: m['MyAccommodationsPage.MyAccommodationsHeader.partnerships'](),
			value: summary?.activePartnershipsCount ?? 0,
			icon: Link2Icon
		}
	]);
</script>

<header class="rounded-xl border border-border bg-card p-5 md:p-6">
	<div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
		<div class="flex max-w-3xl min-w-0 flex-col gap-2">
			<div class="flex flex-wrap items-center gap-2">
				{#if !isLoading && !hasError}
					<Badge variant="outline">
						{m['MyAccommodationsPage.MyAccommodationsHeader.totalBadge']({ count: totalCount })}
					</Badge>
				{/if}
			</div>

			<div>
				<h1 class="text-2xl font-semibold tracking-normal md:text-3xl">
					{m['MyAccommodationsPage.MyAccommodationsHeader.title']()}
				</h1>

				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
					{m['MyAccommodationsPage.MyAccommodationsHeader.description']()}
				</p>
			</div>
		</div>

		<div class="grid gap-3 sm:grid-cols-2 lg:min-w-80">
			{#each overviewItems as item (item.id)}
				<div class="rounded-lg border border-border bg-background/70 p-3">
					<div class="flex items-center justify-between gap-3">
						<span class="text-xs leading-none font-medium text-muted-foreground">{item.label}</span>

						<item.icon class="shrink-0 text-muted-foreground" aria-hidden="true" />
					</div>

					<p class="mt-2 text-2xl leading-none font-semibold tracking-normal">
						{#if isLoading}
							<Spinner class="size-5" />
						{:else}
							{item.value}
						{/if}
					</p>
				</div>
			{/each}
		</div>
	</div>
</header>
