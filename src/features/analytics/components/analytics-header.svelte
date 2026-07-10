<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// LUCIDE ICONS
	import CalendarRangeIcon from '@lucide/svelte/icons/calendar-range';

	let {
		eyebrow,
		title,
		description,
		badge,
		/** Show the "Last 30 days" window chip. All owner analytics is 30-day windowed. */
		showWindow = true
	}: {
		eyebrow: string;
		title: string;
		description: string;
		badge?: string;
		showWindow?: boolean;
	} = $props();
</script>

<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
	<div class="flex max-w-3xl flex-col gap-2">
		<p class="text-xs font-medium text-primary uppercase">{eyebrow}</p>
		<div class="flex items-center gap-3">
			<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
			{#if badge}
				<Badge variant="default">{badge}</Badge>
			{/if}
		</div>
		<p class="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
			{description}
		</p>
	</div>

	{#if showWindow}
		<div
			class="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
		>
			<CalendarRangeIcon class="size-3.5 text-primary" aria-hidden="true" />
			{m['AnalyticsShared.window']()}
		</div>
	{/if}
</header>
