<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import Building2Icon from '@lucide/svelte/icons/building-2';
</script>

<div class="rounded-xl border border-dashed border-border bg-card p-8 text-center">
	<div
		class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
	>
		<Building2Icon class="size-6" aria-hidden="true" />
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<h2 class="text-lg font-semibold tracking-normal">
			{m['MyAccommodationsPage.MyAccommodationsEmpty.title']()}
		</h2>
		<p class="mt-1 max-w-md text-sm text-muted-foreground">
			{m['MyAccommodationsPage.MyAccommodationsEmpty.description']({
				companyName: COMPANY_DATA.NAME
			})}
		</p>
		<p class="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
			<span>{m['MyAccommodationsPage.MyAccommodationsEmpty.hint']()}</span>
			<ArrowRightIcon class="size-3.5" aria-hidden="true" />
		</p>
	</div>
</div>
