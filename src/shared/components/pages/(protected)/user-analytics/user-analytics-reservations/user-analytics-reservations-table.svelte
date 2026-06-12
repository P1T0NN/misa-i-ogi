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

	const columns = $derived([
		{
			id: 'source',
			header: m['AnalyticsReservationsPage.UserAnalyticsReservationsTable.source'](),
			accessor: (row) => row.name,
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'created',
			header: m['AnalyticsReservationsPage.UserAnalyticsReservationsTable.created'](),
			accessor: (row) => formatAnalyticsCount(row.created),
			cellClass: 'tabular-nums'
		},
		{
			id: 'confirmed',
			header: m['AnalyticsReservationsPage.UserAnalyticsReservationsTable.confirmed'](),
			accessor: (row) => formatAnalyticsCount(row.confirmed),
			cellClass: 'tabular-nums'
		},
		{
			id: 'cancelled',
			header: m['AnalyticsReservationsPage.UserAnalyticsReservationsTable.cancelled'](),
			accessor: (row) => formatAnalyticsCount(row.cancelled),
			cellClass: 'tabular-nums'
		},
		{
			id: 'conversion',
			header: m['AnalyticsReservationsPage.UserAnalyticsReservationsTable.conversion'](),
			accessor: (row) => formatAnalyticsConversionRate(row.created, row.confirmed),
			cellClass: 'tabular-nums'
		}
	] satisfies ColumnDef<UserAnalyticsReservationSourceRow>[]);
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-base">
			{m['AnalyticsReservationsPage.UserAnalyticsReservationsTable.title']()}
		</CardTitle>
		<CardDescription>
			{m['AnalyticsReservationsPage.UserAnalyticsReservationsTable.description']()}
		</CardDescription>
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
