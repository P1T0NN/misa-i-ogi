<script lang="ts">
	// COMPONENTS
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '@/shared/components/ui/card/index.js';
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// LUCIDE ICONS
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
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

		<CardContent class="flex flex-col gap-3">
			{#each { length: 2 }}
				<Skeleton class="h-28 rounded-lg" />
			{/each}

			<Button
				href={PROTECTED_PAGE_ENDPOINTS.RESERVATIONS}
				variant="outline"
				size="sm"
				class="w-full"
			>
				View reservations
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
		</CardContent>
	</Card>
</div>
