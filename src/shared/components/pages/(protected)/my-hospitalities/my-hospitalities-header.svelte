<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import Spinner from '@/shared/components/ui/spinner/spinner.svelte';

	// TYPES
	import type { MyHospitalitiesSummary } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// LUCIDE ICONS
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import StoreIcon from '@lucide/svelte/icons/store';

	let {
		isLoading,
		hasError,
		summary
	}: {
		isLoading: boolean;
		hasError: boolean;
		summary: MyHospitalitiesSummary | undefined;
	} = $props();

	const totalCount = $derived(summary?.totalCount ?? 0);

	const overviewItems = $derived([
		{
			label: 'Active venues',
			value: summary?.activeCount ?? 0,
			icon: StoreIcon
		},
		{
			label: 'Partnerships',
			value: summary?.activePartnershipsCount ?? 0,
			icon: Link2Icon
		}
	]);
</script>

<header class="rounded-xl border border-border bg-card p-5 md:p-6">
	<div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
		<div class="flex max-w-3xl min-w-0 flex-col gap-2">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="secondary">Owner workspace</Badge>

				{#if !isLoading && !hasError}
					<Badge variant="outline">{totalCount} total</Badge>
				{/if}
			</div>

			<div>
				<h1 class="text-2xl font-semibold tracking-normal md:text-3xl">My hospitalities</h1>

				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
					Manage venue details, guest-facing availability, and accommodation connections for the
					hospitalities assigned to your account.
				</p>
			</div>
		</div>

		<div class="grid gap-3 sm:grid-cols-2 lg:min-w-80">
			{#each overviewItems as item (item.label)}
				<div class="rounded-lg border border-border bg-background/70 p-3">
					<div class="flex items-center justify-between gap-3">
						<span class="text-xs font-medium leading-none text-muted-foreground">{item.label}</span>

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
