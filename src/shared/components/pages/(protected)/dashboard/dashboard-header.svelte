<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants.js';
</script>

<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
	<div class="flex max-w-3xl flex-col gap-2">
		<p class="text-xs font-medium text-primary uppercase">{m['DashboardPage.DashboardHeader.partnerDashboard']()}</p>

		<h1 class="text-2xl font-semibold sm:text-3xl">{m['DashboardPage.DashboardHeader.title']()}</h1>
		<p class="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
			{m['DashboardPage.DashboardHeader.description']({ companyName: COMPANY_DATA.NAME })}
		</p>
	</div>
</header>
