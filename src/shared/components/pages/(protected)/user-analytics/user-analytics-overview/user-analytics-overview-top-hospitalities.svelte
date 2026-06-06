<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import DataTable from '@/shared/components/ui/data-table/data-table.svelte';
	import UserAnalyticsOverviewTopHospitalitiesLoading from './loading/user-analytics-overview-top-hospitalities-loading.svelte';
	import UserAnalyticsOverviewTopHospitalitiesError from './error/user-analytics-overview-top-hospitalities-error.svelte';

	// UTILS
	import {
		formatAnalyticsConversionRate,
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

	const topHospitalitiesQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsTopHospitalities
			.fetchUserAnalyticsTopHospitalities,
		() => ({})
	);

	const isLoading = $derived(
		topHospitalitiesQuery.data === undefined && !topHospitalitiesQuery.error
	);
	const hasError = $derived(Boolean(topHospitalitiesQuery.error));
	const topHospitalities = $derived(topHospitalitiesQuery.data ?? []);

	function getDetailHref(row: UserAnalyticsRankingRow) {
		return `/analytics/hospitalities/${row.id}`;
	}

	const columns = $derived([
		{
			id: 'entity',
			header: 'Hospitality',
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

{#if isLoading}
	<UserAnalyticsOverviewTopHospitalitiesLoading />
{:else if hasError}
	<UserAnalyticsOverviewTopHospitalitiesError />
{:else}
	<section class="flex min-w-0 flex-col gap-3" aria-labelledby="top-hospitalities-title">
		<div>
			<h2 id="top-hospitalities-title" class="text-lg font-semibold tracking-tight">
				Top hospitalities
			</h2>
			<p class="text-sm text-muted-foreground">
				Venues converting connected stay traffic into reservation requests.
			</p>
		</div>

		<DataTable
			data={topHospitalities}
			{columns}
			getRowId={(row) => row.id}
			customCells={{
				action: actionCell
			}}
			showPagination={false}
		/>
	</section>
{/if}
