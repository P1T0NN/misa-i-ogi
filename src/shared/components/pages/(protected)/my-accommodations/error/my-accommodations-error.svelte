<script lang="ts">
	// COMPONENTS
	import { TryAgainErrorButton } from '@/shared/components/ui/try-again-error-button/index.js';

	// LUCIDE ICONS
	import AlertTriangleIcon from '@lucide/svelte/icons/triangle-alert';
</script>

<div
	class="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center"
>
	<div
		class="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
	>
		<AlertTriangleIcon class="size-6" aria-hidden="true" />
	</div>

	<div class="flex flex-col gap-1">
		<h2 class="text-lg font-semibold">Something went wrong</h2>
		<p class="max-w-sm text-sm text-muted-foreground">Could not load your accommodations.</p>
	</div>

	<TryAgainErrorButton />
</div>
