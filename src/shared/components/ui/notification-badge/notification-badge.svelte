<script lang="ts">
	// COMPONENTS
	import { Badge, type BadgeVariant } from '@/shared/components/ui/badge/index.js';

	let {
		count,
		variant = 'secondary',
		class: className
	}: {
		count: number;
		variant?: BadgeVariant;
		class?: string;
	} = $props();
</script>

{#if count > 0}
	<Badge {variant} class={['ml-1.5 px-1.5 text-[0.65rem]', className]}>
		{count}
	</Badge>
{/if}
