<script lang="ts">
	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import DataTable from '@/shared/components/ui/data-table/data-table.svelte';

	// UTILS
	import {
		formatAnalyticsConversionRate,
		formatAnalyticsCount,
		formatAnalyticsType
	} from '@/features/analytics/utils/analytics-display-formatters';

	// TYPES
	import type { UserAnalyticsRankingRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	let { rows }: { rows: UserAnalyticsRankingRow[] } = $props();

	function getDetailHref(row: UserAnalyticsRankingRow) {
		return `/analytics/accommodations/${row.id}`;
	}

	const columns = $derived([
		{
			id: 'entity',
			header: 'Accommodation',
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
			id: 'scans',
			header: 'Scans',
			accessor: (row) => formatAnalyticsCount(row.primaryMetricValue),
			cellClass: 'tabular-nums'
		},
		{
			id: 'guestActivations',
			header: 'Guest activations',
			accessor: (row) =>
				row.secondaryMetricValue === undefined
					? ''
					: formatAnalyticsCount(row.secondaryMetricValue),
			hideBelow: 'md'
		},
		{
			id: 'requests',
			header: 'Requests',
			accessor: (row) => row.requests,
			cellClass: 'tabular-nums'
		},
		{
			id: 'confirmed',
			header: 'Confirmed',
			accessor: (row) => row.confirmed,
			hideBelow: 'md',
			cellClass: 'tabular-nums'
		},
		{
			id: 'conversionRate',
			header: 'Conversion',
			accessor: (row) => formatAnalyticsConversionRate(row.requests, row.confirmed),
			cellClass: 'tabular-nums'
		},
		{
			id: 'action',
			header: 'Open',
			accessor: (row) => getDetailHref(row),
			headerClass: 'text-right',
			cellClass: 'text-right',
			wrap: true
		}
	] satisfies ColumnDef<UserAnalyticsRankingRow>[]);
</script>

{#snippet actionCell({ row }: DataTableCellSnippetProps<UserAnalyticsRankingRow>)}
	<Button
		href={getDetailHref(row)}
		variant="ghost"
		size="sm"
		class="px-0 md:px-3"
		aria-label={`Open analytics details for ${row.name}`}
	>
		Details
		<ArrowRightIcon data-icon="inline-end" />
	</Button>
{/snippet}

<section class="flex min-w-0 flex-col gap-3" aria-labelledby="accommodations-table-title">
	<div>
		<h2 id="accommodations-table-title" class="text-lg font-semibold tracking-tight">
			Accommodation performance
		</h2>
		<p class="text-sm text-muted-foreground">
			Use this to find strong stays and quiet QR placements.
		</p>
	</div>

	<DataTable
		data={rows}
		{columns}
		getRowId={(row) => row.id}
		customCells={{
			action: actionCell
		}}
		showPagination={false}
	/>
</section>
