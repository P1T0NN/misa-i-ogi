<script lang="ts">
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
		<h2 class="text-lg font-semibold tracking-normal">You do not own any hospitalities</h2>
		<p class="mt-1 max-w-md text-sm text-muted-foreground">
			Reservation requests will appear here once venues are assigned to your account by the
			{COMPANY_DATA.NAME} team.
		</p>
	</div>
</div>
