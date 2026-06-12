<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';

	// LUCIDE ICONS
	import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
</script>

<div class="rounded-xl border border-dashed border-border bg-card p-8 text-center">
	<div
		class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
	>
		<ChartBarIcon class="size-6" aria-hidden="true" />
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<h2 class="text-lg font-semibold tracking-normal">
			{m['AnalyticsOverviewPage.UserAnalyticsOverviewEmpty.title']()}
		</h2>
		<p class="mt-1 max-w-md text-sm text-muted-foreground">
			{m['AnalyticsOverviewPage.UserAnalyticsOverviewEmpty.description']({
				companyName: COMPANY_DATA.NAME
			})}
		</p>
	</div>
</div>
