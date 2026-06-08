<script lang="ts">
	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';

	// LUCIDE ICONS
	import Building2Icon from '@lucide/svelte/icons/building-2';
</script>

<div class="rounded-xl border border-dashed border-border bg-card p-8 text-center">
	<div
		class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
	>
		<Building2Icon class="size-6" aria-hidden="true" />
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<h2 class="text-lg font-semibold tracking-normal">You do not own any accommodations</h2>
		<p class="mt-1 max-w-md text-sm text-muted-foreground">
			Accommodation analytics will appear here once stays are assigned to your account by the
			{COMPANY_DATA.NAME} team.
		</p>
	</div>
</div>
