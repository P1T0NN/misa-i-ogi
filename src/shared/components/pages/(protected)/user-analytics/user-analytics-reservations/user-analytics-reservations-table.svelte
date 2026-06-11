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
	import {
		formatAnalyticsConversionRate,
		formatAnalyticsCount
	} from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

	// TYPES
	import type { UserAnalyticsReservationSourceRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type { ColumnDef } from '@/shared/components/ui/data-table/types.js';

	let { rows }: { rows: UserAnalyticsReservationSourceRow[] } = $props();

	const columns = [
		{
			id: 'source',
			header: 'Source',
			accessor: (row) => row.name,
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'created',
			header: 'Created',
			accessor: (row) => formatAnalyticsCount(row.created),
			cellClass: 'tabular-nums'
		},
		{
			id: 'confirmed',
			header: 'Confirmed',
			accessor: (row) => formatAnalyticsCount(row.confirmed),
			cellClass: 'tabular-nums'
		},
		{
			id: 'cancelled',
			header: 'Cancelled',
			accessor: (row) => formatAnalyticsCount(row.cancelled),
			cellClass: 'tabular-nums'
		},
		{
			id: 'conversion',
			header: 'Conversion',
			accessor: (row) => formatAnalyticsConversionRate(row.created, row.confirmed),
			cellClass: 'tabular-nums'
		}
	] satisfies ColumnDef<UserAnalyticsReservationSourceRow>[];
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-base">Reservation sources</CardTitle>
		<CardDescription>Where requests are coming from and how they convert.</CardDescription>
	</CardHeader>

	<CardContent>
		<DataTable
			data={rows}
			{columns}
			getRowId={(row) => row.id}
			borderless
			showPagination={false}
		/>
	</CardContent>
</Card>
