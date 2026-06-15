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
	import type {
		UserAnalyticsAccommodationTableRow,
		UserAnalyticsPlaceDetailPerformanceRow
	} from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type { AnalyticsTopTableVariant } from '@/features/analytics/types/analyticsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	type AccommodationTableRow =
		| UserAnalyticsAccommodationTableRow
		| AdminAnalyticsTopAccommodationRow;
	type DetailPerformanceRow = UserAnalyticsPlaceDetailPerformanceRow;
	type TableRow = AccommodationTableRow | DetailPerformanceRow;

	let {
		rows,
		variant = 'top',
		title: titleOverride,
		description: descriptionOverride
	}: {
		rows: TableRow[];
		variant?: AnalyticsTopTableVariant;
		title?: string;
		description?: string;
	} = $props();

	const title = $derived(
		titleOverride ??
			(variant === 'performance'
				? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.performanceTitle']()
				: variant === 'admin'
					? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.adminTitle']()
					: variant === 'detailPerformance' || variant === 'dummy'
						? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.detailPerformanceTitle']()
						: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.topTitle']())
	);

	const description = $derived(
		descriptionOverride ??
			(variant === 'performance'
				? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.performanceDescription']()
				: variant === 'admin'
					? m['AnalyticsComponents.AnalyticsTopAccommodationsTable.adminDescription']()
					: variant === 'detailPerformance' || variant === 'dummy'
						? m[
								'AnalyticsComponents.AnalyticsTopAccommodationsTable.detailPerformanceDescription'
							]()
						: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.topDescription']())
	);

	const showAction = $derived(
		variant !== 'admin' && variant !== 'detailPerformance' && variant !== 'dummy'
	);
	const isPreview = $derived(variant === 'dummy');

	function getDetailHref(row: TableRow) {
		return `/analytics/accommodations/${row.id}`;
	}

	function buildColumns(tableVariant: AnalyticsTopTableVariant): ColumnDef<TableRow>[] {
		const columns: ColumnDef<TableRow>[] = [
			{
				id: 'entity',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.entity'](),
				accessor: (row) => row.name,
				cellClass: 'font-medium',
				wrap: true
			}
		];

		if (tableVariant !== 'dummy') {
			columns.push({
				id: 'type',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.type'](),
				accessor: (row) => formatAnalyticsType(row.type),
				hideBelow: 'md'
			});
		}

		if (tableVariant === 'admin') {
			columns.push({
				id: 'city',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.city'](),
				accessor: (row) => row.city ?? '',
				hideBelow: 'lg'
			});
		}

		if (tableVariant === 'detailPerformance' || tableVariant === 'dummy') {
			columns.push(
				{
					id: 'views',
					header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.views'](),
					accessor: (row) => formatAnalyticsCount((row as DetailPerformanceRow).views),
					cellClass: 'tabular-nums'
				},
				{
					id: 'reservations',
					header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.reservations'](),
					accessor: (row) => formatAnalyticsCount((row as DetailPerformanceRow).requests),
					cellClass: 'tabular-nums'
				},
				{
					id: 'confirmed',
					header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.confirmed'](),
					accessor: (row) => formatAnalyticsCount((row as DetailPerformanceRow).confirmed),
					hideBelow: 'md',
					cellClass: 'tabular-nums'
				},
				{
					id: 'conversionRate',
					header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.conversion'](),
					accessor: (row) => {
						const performanceRow = row as DetailPerformanceRow;
						return formatAnalyticsConversionRate(performanceRow.requests, performanceRow.confirmed);
					},
					cellClass: 'tabular-nums'
				}
			);

			return columns;
		}

		columns.push(
			{
				id: 'scans',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.scans'](),
				accessor: (row) => formatAnalyticsCount((row as AccommodationTableRow).scans),
				cellClass: 'tabular-nums'
			},
			{
				id: 'guestActivations',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.guestActivations'](),
				accessor: (row) => formatAnalyticsCount((row as AccommodationTableRow).guestActivations),
				hideBelow: 'md',
				cellClass: 'tabular-nums'
			},
			{
				id: 'reservations',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.reservations'](),
				accessor: (row) => (row as AccommodationTableRow).reservations,
				cellClass: 'tabular-nums'
			},
			{
				id: 'confirmed',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.confirmed'](),
				accessor: (row) => (row as AccommodationTableRow).confirmed,
				hideBelow: 'md',
				cellClass: 'tabular-nums'
			},
			{
				id: 'conversionRate',
				header: m['AnalyticsComponents.AnalyticsTopAccommodationsTable.conversion'](),
				accessor: (row) => {
					const accommodationRow = row as AccommodationTableRow;
					return formatAnalyticsConversionRate(
						accommodationRow.reservations,
						accommodationRow.confirmed
					);
				},
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

{#snippet actionCell({ row }: DataTableCellSnippetProps<TableRow>)}
	<Button
		href={getDetailHref(row)}
		variant="ghost"
		size="sm"
		class="px-0 md:px-3"
		aria-label={m['AnalyticsComponents.AnalyticsTopAccommodationsTable.detailsAriaLabel']({
			name: row.name
		})}
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
			showMobileCards={!isPreview}
			tableClass={isPreview ? 'text-xs sm:text-sm' : undefined}
		/>
	</CardContent>
</Card>
