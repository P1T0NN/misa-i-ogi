<script lang="ts">
	// LUCIDE ICONS
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
</script>

<div
	class="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center"
	role="status"
	aria-label="No recent reservation requests"
>
	<div
		class="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground"
	>
		<CalendarCheckIcon class="size-5" aria-hidden="true" />
	</div>

	<div class="flex max-w-sm flex-col gap-1.5">
		<p class="text-sm font-semibold tracking-tight">No reservation requests yet</p>
		<p class="text-xs leading-relaxed text-muted-foreground">
			When guests start requesting tables through connected accommodations, the newest requests will
			appear here for quick platform oversight.
		</p>
	</div>
</div>
