<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import AlertTriangleIcon from '@lucide/svelte/icons/triangle-alert';

	// COMPONENTS
	import { TryAgainErrorButton } from '@/shared/components/ui/try-again-error-button/index.js';

	let { message }: { message?: string } = $props();
</script>

<div
	class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-6 py-16 text-center"
>
	<div
		class="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
	>
		<AlertTriangleIcon class="size-6" />
	</div>

	<div class="flex flex-col gap-1">
		<h2 class="text-lg font-semibold">{m['AdminUserPage.UserPageError.title']()}</h2>
		<p class="max-w-sm text-sm text-muted-foreground">
			{message ?? m['AdminUserPage.UserPageError.description']()}
		</p>
	</div>

	<TryAgainErrorButton label={m['AdminUserPage.UserPageError.retry']()} />
</div>
