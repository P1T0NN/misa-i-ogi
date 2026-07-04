<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// UTILS
	import { appGoto } from '@/shared/utils/app-navigation';

	// LUCIDE ICONS
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
</script>

<header class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
	<div class="flex min-w-0 flex-col gap-1 sm:flex-1">
		<h1 class="text-2xl font-semibold tracking-tight">
			{m['AddHospitalityPage.AddHospitalityHeader.title']()}
		</h1>

		<p class="text-sm leading-relaxed text-muted-foreground">
			{m['AddHospitalityPage.AddHospitalityHeader.description']()}
		</p>
	</div>

	<Button
		variant="outline"
		onclick={() => appGoto(PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITIES)}
		class="w-full shrink-0 sm:w-auto sm:self-center"
	>
		<ArrowLeftIcon data-icon="inline-start" />
		{m['AddHospitalityPage.AddHospitalityHeader.back']()}
	</Button>
</header>
