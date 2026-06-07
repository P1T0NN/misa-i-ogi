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
</header>
