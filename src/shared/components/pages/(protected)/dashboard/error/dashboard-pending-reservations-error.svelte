<script lang="ts">
	// COMPONENTS
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '@/shared/components/ui/card/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// LUCIDE ICONS
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
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

		<CardContent class="flex flex-col items-center gap-4 py-8 text-center">
			<div class="flex size-12 items-center justify-center rounded-full bg-destructive/10">
				<AlertTriangleIcon class="size-5 text-destructive" />
			</div>
			<div>
				<p class="text-sm font-medium">Could not load reservations</p>
				<p class="mt-1 text-xs text-muted-foreground">Please try again or check back later.</p>
			</div>

			<Button href={PROTECTED_PAGE_ENDPOINTS.RESERVATIONS} variant="outline" size="sm">
				View all reservations
			</Button>
		</CardContent>
	</Card>
</div>
