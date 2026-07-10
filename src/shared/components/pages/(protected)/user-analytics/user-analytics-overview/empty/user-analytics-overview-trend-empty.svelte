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
		<CardTitle>{m['AnalyticsOverviewPage.UserAnalyticsOverviewTrendEmpty.title']()}</CardTitle>
		<CardDescription>
			{m['AnalyticsOverviewPage.UserAnalyticsOverviewTrendEmpty.description']()}
		</CardDescription>
	</CardHeader>
	<CardContent class="flex h-72 items-center justify-center px-4 text-center">
		<p class="text-sm text-muted-foreground">
			{m['AnalyticsOverviewPage.UserAnalyticsOverviewTrendEmpty.body']()}
		</p>
	</CardContent>
</Card>
