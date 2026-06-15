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
	import type { AdminAnalyticsTopHospitalityRow } from '@/convex/pages/adminAnalytics/types/adminAnalyticsTypes';
	import type {
		UserAnalyticsHospitalityTableRow,
		UserAnalyticsPlaceDetailPerformanceRow
	} from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type { AnalyticsTopTableVariant } from '@/features/analytics/types/analyticsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	type HospitalityTableRow = UserAnalyticsHospitalityTableRow | AdminAnalyticsTopHospitalityRow;
	type DetailPerformanceRow = UserAnalyticsPlaceDetailPerformanceRow;
	type TableRow = HospitalityTableRow | DetailPerformanceRow;

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
				? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.performanceTitle']()
				: variant === 'admin'
					? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.adminTitle']()
					: variant === 'detailPerformance' || variant === 'dummy'
						? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.detailPerformanceTitle']()
						: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.topTitle']())
	);

	const description = $derived(
		descriptionOverride ??
			(variant === 'performance'
				? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.performanceDescription']()
				: variant === 'admin'
					? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.adminDescription']()
					: variant === 'detailPerformance' || variant === 'dummy'
						? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.detailPerformanceDescription']()
						: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.topDescription']())
	);

	const showAction = $derived(
		variant !== 'admin' && variant !== 'detailPerformance' && variant !== 'dummy'
	);
	const isPreview = $derived(variant === 'dummy');

	function getDetailHref(row: TableRow) {
		return `/analytics/hospitalities/${row.id}`;
	}

	function buildColumns(tableVariant: AnalyticsTopTableVariant): ColumnDef<TableRow>[] {
		const columns: ColumnDef<TableRow>[] = [
			{
				id: 'entity',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.entity'](),
				accessor: (row) => row.name,
				cellClass: 'font-medium',
				wrap: true
			}
		];

		if (tableVariant !== 'dummy') {
			columns.push({
				id: 'type',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.type'](),
				accessor: (row) => formatAnalyticsType(row.type),
				hideBelow: 'md'
			});
		}

		if (tableVariant === 'admin') {
			columns.push({
				id: 'city',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.city'](),
				accessor: (row) => row.city ?? '',
				hideBelow: 'lg'
			});
		}

		if (tableVariant === 'detailPerformance' || tableVariant === 'dummy') {
			columns.push(
				{
					id: 'views',
					header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.views'](),
					accessor: (row) => formatAnalyticsCount((row as DetailPerformanceRow).views),
					cellClass: 'tabular-nums'
				},
				{
					id: 'reservations',
					header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.reservations'](),
					accessor: (row) => formatAnalyticsCount((row as DetailPerformanceRow).requests),
					cellClass: 'tabular-nums'
				},
				{
					id: 'confirmed',
					header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.confirmed'](),
					accessor: (row) => formatAnalyticsCount((row as DetailPerformanceRow).confirmed),
					hideBelow: 'md',
					cellClass: 'tabular-nums'
				},
				{
					id: 'conversionRate',
					header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.conversion'](),
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
				id: 'guestViews',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.guestViews'](),
				accessor: (row) => formatAnalyticsCount((row as HospitalityTableRow).guestViews),
				cellClass: 'tabular-nums'
			},
			{
				id: 'reservations',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.reservations'](),
				accessor: (row) => (row as HospitalityTableRow).reservations,
				cellClass: 'tabular-nums'
			},
			{
				id: 'confirmed',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.confirmed'](),
				accessor: (row) => (row as HospitalityTableRow).confirmed,
				hideBelow: 'md',
				cellClass: 'tabular-nums'
			},
			{
				id: 'conversionRate',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.conversion'](),
				accessor: (row) => {
					const hospitalityRow = row as HospitalityTableRow;
					return formatAnalyticsConversionRate(
						hospitalityRow.reservations,
						hospitalityRow.confirmed
					);
				},
				cellClass: 'tabular-nums'
			}
		);

		if (tableVariant !== 'admin') {
			columns.push({
				id: 'action',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.open'](),
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
		aria-label={m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.detailsAriaLabel']({
			name: row.name
		})}
	>
		{m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.details']()}
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
