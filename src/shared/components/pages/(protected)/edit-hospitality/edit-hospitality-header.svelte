<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	/** Back-link target + label — default to the owner's list; the admin route overrides both. */
	let {
		backHref = PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITIES,
		backLabel = m['EditHospitalityPage.EditHospitalityHeader.back']()
	}: { backHref?: string; backLabel?: string } = $props();
</script>

<header class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
	<div class="flex min-w-0 flex-col gap-1 sm:flex-1">
		<h1 class="text-2xl font-semibold tracking-tight">
			{m['EditHospitalityPage.EditHospitalityHeader.title']()}
		</h1>
		<p class="text-sm leading-relaxed text-muted-foreground">
			{m['EditHospitalityPage.EditHospitalityHeader.description']()}
		</p>
	</div>
	<Button variant="outline" href={backHref} class="w-full shrink-0 sm:w-auto sm:self-center">
		<ArrowLeftIcon data-icon="inline-start" />
		{backLabel}
	</Button>
</header>
