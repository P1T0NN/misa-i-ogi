<script lang="ts">
	// COMPONENTS
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@/shared/components/ui/table/index.js';

	// UTILS
	import { formatAnalyticsConversionRate } from '@/features/analytics/utils/analytics-display-formatters';

	// TYPES
	import type { UserAnalyticsReservationSourceRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';

	let { rows }: { rows: UserAnalyticsReservationSourceRow[] } = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-base">Reservation sources</CardTitle>
		<CardDescription>Where requests are coming from and how they convert.</CardDescription>
	</CardHeader>
	<CardContent>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Source</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Confirmed</TableHead>
					<TableHead>Cancelled</TableHead>
					<TableHead>Conversion</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{#if rows.length === 0}
					<TableRow>
						<TableCell colspan={5} class="h-24 text-center text-sm text-muted-foreground">
							Reservation sources will appear here after guests submit requests.
						</TableCell>
					</TableRow>
				{:else}
					{#each rows as row (row.id)}
						<TableRow>
							<TableCell>
								<div class="min-w-56">
									<p class="font-medium">{row.name}</p>
								</div>
							</TableCell>
							<TableCell>{row.created}</TableCell>
							<TableCell>{row.confirmed}</TableCell>
							<TableCell>{row.cancelled}</TableCell>
							<TableCell>{formatAnalyticsConversionRate(row.created, row.confirmed)}</TableCell>
						</TableRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	</CardContent>
</Card>
