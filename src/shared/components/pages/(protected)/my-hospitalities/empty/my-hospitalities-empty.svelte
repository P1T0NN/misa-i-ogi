<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import PlusIcon from '@lucide/svelte/icons/plus';
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
			{m['MyHospitalitiesPage.MyHospitalitiesEmpty.description']()}
		</p>

		<Button href={PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITY_ADD} class="mt-2">
			<PlusIcon data-icon="inline-start" />
			{m['MyHospitalitiesPage.MyHospitalitiesEmpty.cta']()}
		</Button>
	</div>
</div>
