<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	let {
		eyebrow,
		title,
		description,
		badge
	}: {
		eyebrow: string;
		title: string;
		description: string;
		badge?: string;
	} = $props();
</script>

<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
	<div class="flex max-w-3xl flex-col gap-2">
		<p class="text-xs font-medium text-primary uppercase">{eyebrow}</p>
		<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
		<p class="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
			{description}
		</p>
	</div>

	{#if badge}
		<Badge variant="outline">{badge}</Badge>
	{/if}
</header>
