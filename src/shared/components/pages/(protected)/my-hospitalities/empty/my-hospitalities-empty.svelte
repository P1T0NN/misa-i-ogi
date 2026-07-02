<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import StoreIcon from '@lucide/svelte/icons/store';
</script>

<div class="rounded-xl border border-dashed border-border bg-card p-8 text-center">
	<div
		class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
	>
		<StoreIcon class="size-6" aria-hidden="true" />
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<h2 class="text-lg font-semibold tracking-normal">
			{m['MyHospitalitiesPage.MyHospitalitiesEmpty.title']()}
		</h2>
		<p class="mt-1 max-w-md text-sm text-muted-foreground">
			{m['MyHospitalitiesPage.MyHospitalitiesEmpty.description']({
				companyName: COMPANY_DATA.NAME
			})}
		</p>
		<p class="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
			<span>{m['MyHospitalitiesPage.MyHospitalitiesEmpty.hint']()}</span>
			<ArrowRightIcon class="size-3.5" aria-hidden="true" />
		</p>
	</div>
</div>
