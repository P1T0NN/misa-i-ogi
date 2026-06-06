<script lang="ts">
	// COMPONENTS
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '@/shared/components/ui/card/index.js';

	// LUCIDE ICONS
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
</script>

<div class="min-w-0">
	<Card>
		<CardHeader>
			<div class="flex items-start justify-between gap-3">
				<div>
					<CardTitle class="text-base">Pending reservations</CardTitle>
					<CardDescription>Requests waiting for your response.</CardDescription>
				</div>
				<CalendarCheckIcon class="size-5 text-muted-foreground" />
			</div>
		</CardHeader>

		<CardContent class="flex flex-col items-center gap-4 py-10 text-center">
			<div class="flex size-12 items-center justify-center rounded-full bg-secondary">
				<CalendarCheckIcon class="size-5 text-muted-foreground" />
			</div>
			<div>
				<p class="text-sm font-medium">All caught up</p>
				<p class="mt-1 text-xs text-muted-foreground">No pending reservation requests to review.</p>
			</div>
		</CardContent>
	</Card>
</div>
