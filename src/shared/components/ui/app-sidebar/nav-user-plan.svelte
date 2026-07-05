<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu/index.js';
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// LUCIDE ICONS
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import CrownIcon from '@lucide/svelte/icons/crown';

	// Purely presentational — the parent owns the plan derivation (single source of truth).
	let {
		isPro,
		trialActive,
		trialEnded,
		daysLeft
	}: {
		isPro: boolean;
		trialActive: boolean;
		trialEnded: boolean;
		daysLeft: number;
	} = $props();

	const daysLeftLabel = $derived(
		daysLeft <= 1
			? m['NavUserPlan.trialLastDay']()
			: m['NavUserPlan.trialDaysLeft']({ days: daysLeft })
	);

	// TODO: point at the real upgrade/checkout route once it exists.
	const UPGRADE_HREF = '#';
</script>

{#if isPro}
	<!-- Pro: reassuring status, nothing to act on. -->
	<div class="flex items-center gap-2 px-1.5 py-1.5">
		<CrownIcon class="size-4 shrink-0 text-primary" aria-hidden="true" />
		<div class="grid min-w-0 flex-1 leading-tight">
			<span class="text-sm font-medium">{m['NavUserPlan.pro']()}</span>
			<span class="truncate text-xs text-muted-foreground">
				{m['NavUserPlan.proDescription']()}
			</span>
		</div>
		<Badge variant="success">{m['NavUserPlan.proActive']()}</Badge>
	</div>
{:else}
	<!-- Non-pro: trial context (if any) sits right above the single upgrade action. -->
	{#if trialActive}
		<div class="flex items-center justify-between gap-2 px-1.5 pt-1.5 pb-1">
			<span class="text-xs font-medium text-muted-foreground">{m['NavUserPlan.freeTrial']()}</span>
			<Badge variant="outline" class="border-primary/30 text-primary">{daysLeftLabel}</Badge>
		</div>
	{:else if trialEnded}
		<div class="px-1.5 pt-1.5 pb-1">
			<span class="text-xs font-medium text-muted-foreground">{m['NavUserPlan.trialEnded']()}</span>
		</div>
	{/if}

	<DropdownMenu.Item class="bg-primary/5 text-primary focus:bg-primary/10 focus:text-primary">
		{#snippet child({ props })}
			<a href={UPGRADE_HREF} {...props}>
				<SparklesIcon aria-hidden="true" />
				<span class="font-medium">{m['NavUserPlan.upgrade']()}</span>
			</a>
		{/snippet}
	</DropdownMenu.Item>
{/if}
