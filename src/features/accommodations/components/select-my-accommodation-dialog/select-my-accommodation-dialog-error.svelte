<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { TryAgainErrorButton } from '@/shared/components/ui/try-again-error-button/index.js';

	// LUCIDE ICONS
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
</script>

<div class="flex flex-col items-center gap-3 px-6 py-10 text-center">
	<div
		class="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive"
		aria-hidden="true"
	>
		<AlertTriangleIcon class="size-5" />
	</div>

	<div class="flex max-w-xs flex-col gap-1">
		<p class="text-sm font-medium text-foreground">
			{m['SelectMyAccommodationDialog.Error.title']()}
		</p>
		<p class="text-sm text-muted-foreground">
			{m['SelectMyAccommodationDialog.Error.description']()}
		</p>
	</div>

	<TryAgainErrorButton />
</div>
