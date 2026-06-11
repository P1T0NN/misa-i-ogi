<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Card, CardContent } from '@/shared/components/ui/card/index.js';

	/**
	 * One row of the user danger zone: title + description on the left, an
	 * action affordance (button, ActionButton, etc.) on the right. Stacks on
	 * mobile, side-by-side from `md` up.
	 */
	let {
		title,
		description,
		children
	}: {
		title: string;
		description: string;
		children: Snippet;
	} = $props();
</script>

<Card class="gap-0 rounded-md border-destructive/30 py-0 shadow-none">
	<CardContent
		class="flex flex-col items-start justify-between gap-3 p-4 md:flex-row md:items-center"
	>
		<div class="flex flex-col gap-0.5">
			<h3 class="text-sm font-semibold">{title}</h3>
			<p class="text-sm text-muted-foreground">{description}</p>
		</div>
		<div class="shrink-0">{@render children()}</div>
	</CardContent>
</Card>
