<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
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
		formatAnalyticsCount,
		formatAnalyticsType
	} from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

	// TYPES
	import type { AdminAnalyticsTopAccommodationRow } from '@/convex/pages/adminAnalytics/types/adminAnalyticsTypes';
	import type { UserAnalyticsAccommodationTableRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type { AnalyticsTopTableVariant } from '@/features/analytics/types/analyticsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	type AccommodationTableRow = UserAnalyticsAccommodationTableRow | AdminAnalyticsTopAccommodationRow;

	let {
		rows,
		variant = 'top'
	}: {
		rows: AccommodationTableRow[];
		variant?: AnalyticsTopTableVariant;
	} = $props();

	const title = $derived(
		variant === 'performance'
			? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.performanceTitle']()
			: variant === 'admin'
				? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.adminTitle']()
				: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.topTitle']()
	);

	const description = $derived(
		variant === 'performance'
			? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.performanceDescription']()
			: variant === 'admin'
				? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.adminDescription']()
				: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.topDescription']()
	);

	const showAction = $derived(variant !== 'admin');

	function getDetailHref(row: AccommodationTableRow) {
		return `/analytics/accommodations/${row.id}`;
	}

	function buildColumns(tableVariant: AnalyticsTopTableVariant): ColumnDef<AccommodationTableRow>[] {
		const columns: ColumnDef<AccommodationTableRow>[] = [
			{
				id: 'entity',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.entity'](),
				accessor: (row) => row.name,
				cellClass: 'font-medium',
				wrap: true
			},
			{
				id: 'type',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.type'](),
				accessor: (row) => formatAnalyticsType(row.type),
				hideBelow: 'md'
			}
		];

		if (tableVariant === 'admin') {
			columns.push({
				id: 'city',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.city'](),
				accessor: (row) => row.city ?? '',
				hideBelow: 'lg'
			});
		}

		columns.push(
			{
				id: 'scans',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.scans'](),
				accessor: (row) => formatAnalyticsCount(row.scans),
				cellClass: 'tabular-nums'
			},
			{
				id: 'guestActivations',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.guestActivations'](),
				accessor: (row) => formatAnalyticsCount(row.guestActivations),
				hideBelow: 'md',
				cellClass: 'tabular-nums'
			},
			{
				id: 'reservations',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.reservations'](),
				accessor: (row) => row.reservations,
				cellClass: 'tabular-nums'
			},
			{
				id: 'confirmed',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.confirmed'](),
				accessor: (row) => row.confirmed,
				hideBelow: 'md',
				cellClass: 'tabular-nums'
			},
			{
				id: 'conversionRate',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.conversion'](),
				accessor: (row) => formatAnalyticsConversionRate(row.reservations, row.confirmed),
				cellClass: 'tabular-nums'
			}
		);

		if (tableVariant !== 'admin') {
			columns.push({
				id: 'action',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.open'](),
				accessor: (row) => getDetailHref(row),
				headerClass: 'text-right',
				cellClass: 'text-right',
				wrap: true
			});
		}

		return columns;
	}

	const columns = $derived(buildColumns(variant));
</script>

{#snippet actionCell({ row }: DataTableCellSnippetProps<AccommodationTableRow>)}
	<Button
		href={getDetailHref(row)}
		variant="ghost"
		size="sm"
		class="px-0 md:px-3"
		aria-label={m['AnalyticsComponents.AnalyticsTopAccommodationsTable.detailsAriaLabel']({ name: row.name })}
	>
		{m['AnalyticsComponents.AnalyticsTopAccommodationsTable.details']()}
		<ArrowRightIcon data-icon="inline-end" />
	</Button>
{/snippet}

<Card class="min-w-0">
	<CardHeader>
		<CardTitle class="text-base">{title}</CardTitle>
		<CardDescription>{description}</CardDescription>
	</CardHeader>

	<CardContent>
		<DataTable
			data={rows}
			{columns}
			getRowId={(row) => row.id}
			customCells={showAction ? { action: actionCell } : {}}
			borderless
			showPagination={false}
		/>
	</CardContent>
</Card>
