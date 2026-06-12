<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
</script>

<Card>
	<CardHeader>
		<CardTitle>
			{m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChartEmpty.title']()}
		</CardTitle>
		<CardDescription>
			{m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChartEmpty.description']()}
		</CardDescription>
	</CardHeader>
	<CardContent class="flex h-80 items-center justify-center px-4 text-center">
		<p class="text-sm text-muted-foreground">
			{m['AnalyticsReservationsPage.UserAnalyticsReservationsStatusChartEmpty.body']()}
		</p>
	</CardContent>
</Card>
