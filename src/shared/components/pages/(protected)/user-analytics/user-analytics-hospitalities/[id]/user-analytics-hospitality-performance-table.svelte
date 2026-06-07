<script lang="ts">
	// COMPONENTS
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
	import DataTable from '@/shared/components/ui/data-table/data-table.svelte';

	// UTILS
	import { formatAnalyticsConversionRate } from '@/features/analytics/utils/analytics-display-formatters';

	// TYPES
	import type { ColumnDef } from '@/shared/components/ui/data-table/types.js';

	type PerformanceRow = {
		id: string;
		name: string;
		type: string;
		city: string;
		views: number;
		requests: number;
		confirmed: number;
	};

	let { rows }: { rows: PerformanceRow[] } = $props();

	const columns: ColumnDef<Record<string, unknown>>[] = [
		{
			id: 'name',
			header: 'Accommodation',
			accessor: (row) => (row as PerformanceRow).name,
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'views',
			header: 'Views',
			accessor: (row) => (row as PerformanceRow).views,
			cellClass: 'tabular-nums'
		},
		{
			id: 'requests',
			header: 'Requests',
			accessor: (row) => (row as PerformanceRow).requests,
			cellClass: 'tabular-nums'
		},
		{
			id: 'confirmed',
			header: 'Confirmed',
			accessor: (row) => (row as PerformanceRow).confirmed,
			cellClass: 'tabular-nums'
		},
		{
			id: 'conversionRate',
			header: 'Conversion',
			accessor: (row) => {
				const performanceRow = row as PerformanceRow;
				return formatAnalyticsConversionRate(performanceRow.requests, performanceRow.confirmed);
			},
			cellClass: 'tabular-nums'
		}
	] satisfies ColumnDef<Record<string, unknown>>[];
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-base">Source stays</CardTitle>
		<CardDescription>Accommodations that send guests to this hospitality.</CardDescription>
	</CardHeader>

	<CardContent>
		<DataTable
			data={rows as Record<string, unknown>[]}
			{columns}
			borderless
			showPagination={false}
		/>
	</CardContent>
</Card>
