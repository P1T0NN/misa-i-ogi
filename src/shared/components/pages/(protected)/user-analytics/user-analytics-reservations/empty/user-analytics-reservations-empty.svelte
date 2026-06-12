<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';

	// LUCIDE ICONS
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
</script>

<div class="rounded-xl border border-dashed border-border bg-card p-8 text-center">
	<div
		class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
	>
		<CalendarCheckIcon class="size-6" aria-hidden="true" />
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<h2 class="text-lg font-semibold tracking-normal">
			{m['AnalyticsReservationsPage.UserAnalyticsReservationsEmpty.title']()}
		</h2>
		<p class="mt-1 max-w-md text-sm text-muted-foreground">
			{m['AnalyticsReservationsPage.UserAnalyticsReservationsEmpty.description']({
				companyName: COMPANY_DATA.NAME
			})}
		</p>
	</div>
</div>
