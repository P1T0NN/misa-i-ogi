<script lang="ts">
	// SVELTEKIT IMPORTS
	import { invalidateAll } from '$app/navigation';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import AlertTriangleIcon from '@lucide/svelte/icons/triangle-alert';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
</script>

<div class="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
	<div class="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
		<AlertTriangleIcon class="size-6" aria-hidden="true" />
	</div>

	<div class="flex flex-col gap-1">
		<h2 class="text-lg font-semibold">Something went wrong</h2>
		<p class="text-muted-foreground max-w-sm text-sm">Could not load your hospitality venues.</p>
	</div>

	<Button variant="outline" size="sm" onclick={() => invalidateAll()}>
		<RefreshCwIcon class="size-4" />
		Try again
	</Button>
</div>
