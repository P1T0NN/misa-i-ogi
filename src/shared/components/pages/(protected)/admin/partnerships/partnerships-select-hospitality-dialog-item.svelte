<script lang="ts">
	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	let {
		hospitality,
		selected,
		onSelect
	}: {
		hospitality: Doc<'hospitalities'>;
		selected: boolean;
		onSelect: () => void;
	} = $props();
</script>

<li>
	<button
		type="button"
		role="option"
		aria-selected={selected}
		class={cn(
			'flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
			selected && 'bg-accent'
		)}
		onclick={onSelect}
	>
		<span class="leading-snug font-medium">{hospitality.name}</span>
		<span class="font-mono text-xs leading-snug text-muted-foreground">{hospitality._id}</span>
	</button>
</li>
