<script lang="ts">
	// COMPONENTS
	import DataTable from '@/shared/components/ui/data-table/data-table.svelte';

	// UTILS
	import {
		formatAnalyticsConversionRate,
		formatAnalyticsCount,
		formatAnalyticsType
	} from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

	// TYPES
	import type { AdminAnalyticsTopEntityRow } from '@/convex/pages/adminAnalytics/types/adminAnalyticsTypes';
	import type { ColumnDef } from '@/shared/components/ui/data-table/types';

	let {
		title,
		description,
		entityLabel,
		primaryLabel,
		secondaryLabel,
		rows
	}: {
		title: string;
		description: string;
		entityLabel: string;
		primaryLabel: string;
		secondaryLabel: string;
		rows: AdminAnalyticsTopEntityRow[];
	} = $props();

	const columns = $derived([
		{
			id: 'entity',
			header: entityLabel,
			accessor: (row) => row.name,
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'type',
			header: 'Type',
			accessor: (row) => formatAnalyticsType(row.type),
			hideBelow: 'md'
		},
		{
			id: 'city',
			header: 'City',
			accessor: (row) => row.city,
			hideBelow: 'lg'
		},
		{
			id: 'primary',
			header: primaryLabel,
			accessor: (row) => formatAnalyticsCount(row.primaryValue),
			cellClass: 'tabular-nums'
		},
		{
			id: 'secondary',
			header: secondaryLabel,
			accessor: (row) => formatAnalyticsCount(row.secondaryValue),
			hideBelow: 'md',
			cellClass: 'tabular-nums'
		},
		{
			id: 'requests',
			header: 'Requests',
			accessor: (row) => row.requests,
			hideBelow: 'md',
			cellClass: 'tabular-nums'
		},
		{
			id: 'conversion',
			header: 'Conversion',
			accessor: (row) => formatAnalyticsConversionRate(row.requests, row.confirmed),
			cellClass: 'tabular-nums'
		}
	] satisfies ColumnDef<AdminAnalyticsTopEntityRow>[]);
</script>

<section class="flex min-w-0 flex-col gap-3" aria-label={title}>
	<div>
		<h2 class="text-lg font-semibold tracking-tight">{title}</h2>
		<p class="text-sm text-muted-foreground">{description}</p>
	</div>

	<DataTable data={rows} {columns} getRowId={(row) => row.id} showPagination={false} />
</section>
