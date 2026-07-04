<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import BedDoubleIcon from '@lucide/svelte/icons/bed-double';
	import PlusIcon from '@lucide/svelte/icons/plus';
</script>

<div class="flex flex-col items-center gap-3 px-6 py-10 text-center">
	<div
		class="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground"
		aria-hidden="true"
	>
		<BedDoubleIcon class="size-5" />
	</div>

	<div class="flex max-w-xs flex-col gap-1">
		<p class="text-sm font-medium text-foreground">
			{m['SelectMyAccommodationDialog.Empty.title']()}
		</p>
		<p class="text-sm text-muted-foreground">
			{m['SelectMyAccommodationDialog.Empty.description']()}
		</p>
	</div>

	<Button href={PROTECTED_PAGE_ENDPOINTS.MY_ACCOMMODATION_ADD} size="sm" class="mt-1">
		<PlusIcon data-icon="inline-start" />
		{m['SelectMyAccommodationDialog.Empty.cta']()}
	</Button>
</div>
