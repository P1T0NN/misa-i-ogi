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
	import { formatAnalyticsConversionRate } from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

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

	const columns = $derived([
		{
			id: 'name',
			header: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityPerformanceTable.accommodation'](),
			accessor: (row) => (row as PerformanceRow).name,
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'views',
			header: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityPerformanceTable.views'](),
			accessor: (row) => (row as PerformanceRow).views,
			cellClass: 'tabular-nums'
		},
		{
			id: 'requests',
			header: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityPerformanceTable.reservations'](),
			accessor: (row) => (row as PerformanceRow).requests,
			cellClass: 'tabular-nums'
		},
		{
			id: 'confirmed',
			header: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityPerformanceTable.confirmed'](),
			accessor: (row) => (row as PerformanceRow).confirmed,
			cellClass: 'tabular-nums'
		},
		{
			id: 'conversionRate',
			header: m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityPerformanceTable.conversion'](),
			accessor: (row) => {
				const performanceRow = row as PerformanceRow;
				return formatAnalyticsConversionRate(performanceRow.requests, performanceRow.confirmed);
			},
			cellClass: 'tabular-nums'
		}
	] satisfies ColumnDef<Record<string, unknown>>[]);
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-base">
			{m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityPerformanceTable.title']()}
		</CardTitle>
		<CardDescription>
			{m['AnalyticsHospitalityDetailPage.UserAnalyticsHospitalityPerformanceTable.description']()}
		</CardDescription>
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
