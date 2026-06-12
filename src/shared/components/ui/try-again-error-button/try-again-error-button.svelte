<script lang="ts">
	// SVELTEKIT IMPORTS
	import { invalidateAll } from '$app/navigation';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';

	let {
		label = m['ErrorComponent.TryAgain.label'](),
		class: className
	}: {
		label?: string;
		class?: string;
	} = $props();
</script>

<Button variant="outline" size="sm" class={className} onclick={() => invalidateAll()}>
	<RefreshCwIcon class="size-4" />
	{label}
</Button>
