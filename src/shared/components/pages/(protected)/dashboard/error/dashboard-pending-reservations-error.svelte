<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '@/shared/components/ui/card/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// LUCIDE ICONS
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
</script>

<div class="min-w-0">
	<Card>
		<CardHeader>
			<div class="flex items-start justify-between gap-3">
				<div>
					<CardTitle class="text-base">
						{m['DashboardPage.DashboardPendingReservationsError.cardTitle']()}
					</CardTitle>
					<CardDescription>
						{m['DashboardPage.DashboardPendingReservationsError.cardDescription']()}
					</CardDescription>
				</div>
				<CalendarCheckIcon class="size-5 text-muted-foreground" />
			</div>
		</CardHeader>

		<CardContent>
			<ErrorComponent
				variant="content"
				title={m['DashboardPage.DashboardPendingReservationsError.title']()}
				description={m['DashboardPage.DashboardPendingReservationsError.description']()}
				showRetry={false}
			>
				<Button href={PROTECTED_PAGE_ENDPOINTS.RESERVATIONS} variant="outline" size="sm">
					{m['DashboardPage.DashboardPendingReservationsError.viewAll']()}
				</Button>
			</ErrorComponent>
		</CardContent>
	</Card>
</div>
