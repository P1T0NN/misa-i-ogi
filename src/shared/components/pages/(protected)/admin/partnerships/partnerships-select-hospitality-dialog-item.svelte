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
			'hover:bg-accent focus-visible:ring-ring flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
			selected && 'bg-accent'
		)}
		onclick={onSelect}
	>
		<span class="font-medium leading-snug">{hospitality.name}</span>
		<span class="text-muted-foreground font-mono text-xs leading-snug">{hospitality._id}</span>
	</button>
</li>
