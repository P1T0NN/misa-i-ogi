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
	import type { UserAnalyticsHospitalityTableRow } from '@/convex/pages/userAnalytics/types/userAnalyticsTypes';
	import type { AnalyticsTopTableVariant } from '@/features/analytics/types/analyticsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	type HospitalityTableRow = UserAnalyticsHospitalityTableRow | AdminAnalyticsTopHospitalityRow;

	let {
		rows,
		variant = 'top'
	}: {
		rows: HospitalityTableRow[];
		variant?: AnalyticsTopTableVariant;
	} = $props();

	const title = $derived(
		variant === 'performance'
			? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.performanceTitle']()
			: variant === 'admin'
				? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.adminTitle']()
				: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.topTitle']()
	);

	const description = $derived(
		variant === 'performance'
			? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.performanceDescription']()
			: variant === 'admin'
				? m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.adminDescription']()
				: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.topDescription']()
	);

	const showAction = $derived(variant !== 'admin');

	function getDetailHref(row: HospitalityTableRow) {
		return `/analytics/hospitalities/${row.id}`;
	}

	function buildColumns(tableVariant: AnalyticsTopTableVariant): ColumnDef<HospitalityTableRow>[] {
		const columns: ColumnDef<HospitalityTableRow>[] = [
			{
				id: 'entity',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.entity'](),
				accessor: (row) => row.name,
				cellClass: 'font-medium',
				wrap: true
			},
			{
				id: 'type',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.type'](),
				accessor: (row) => formatAnalyticsType(row.type),
				hideBelow: 'md'
			}
		];

		if (tableVariant === 'admin') {
			columns.push({
				id: 'city',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.city'](),
				accessor: (row) => row.city ?? '',
				hideBelow: 'lg'
			});
		}

		columns.push(
			{
				id: 'guestViews',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.guestViews'](),
				accessor: (row) => formatAnalyticsCount(row.guestViews),
				cellClass: 'tabular-nums'
			},
			{
				id: 'reservations',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.reservations'](),
				accessor: (row) => row.reservations,
				cellClass: 'tabular-nums'
			},
			{
				id: 'confirmed',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.confirmed'](),
				accessor: (row) => row.confirmed,
				hideBelow: 'md',
				cellClass: 'tabular-nums'
			},
			{
				id: 'conversionRate',
				header: m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.conversion'](),
				accessor: (row) => formatAnalyticsConversionRate(row.reservations, row.confirmed),
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

{#snippet actionCell({ row }: DataTableCellSnippetProps<HospitalityTableRow>)}
	<Button
		href={getDetailHref(row)}
		variant="ghost"
		size="sm"
		class="px-0 md:px-3"
		aria-label={m['AnalyticsComponents.AnalyticsTopHospitalitiesTable.detailsAriaLabel']({ name: row.name })}
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
		/>
	</CardContent>
</Card>
