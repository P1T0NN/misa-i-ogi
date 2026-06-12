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
			{m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesChartEmpty.title']()}
		</CardTitle>
		<CardDescription>
			{m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesChartEmpty.description']()}
		</CardDescription>
	</CardHeader>
	<CardContent class="flex h-80 items-center justify-center px-4 text-center">
		<p class="text-sm text-muted-foreground">
			{m['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesChartEmpty.body']()}
		</p>
	</CardContent>
</Card>
