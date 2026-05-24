<script lang="ts">
	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';
	
	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import StoreIcon from '@lucide/svelte/icons/store';
</script>

<div class="rounded-xl border border-dashed border-border bg-card p-8 text-center">
	<div class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
		<StoreIcon class="size-6" aria-hidden="true" />
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<h2 class="text-lg font-semibold tracking-normal">No hospitality venues assigned yet</h2>
		<p class="text-muted-foreground mt-1 max-w-md text-sm">
			When the {COMPANY_DATA.NAME} team assigns a hospitality venue to your account, it will appear here.
		</p>
		<p class="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs font-medium">
			<span>Assigned venues become editable from this page</span>
			<ArrowRightIcon class="size-3.5" aria-hidden="true" />
		</p>
	</div>
</div>
