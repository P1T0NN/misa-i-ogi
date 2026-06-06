<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import DataTable from '@/shared/components/ui/data-table/data-table.svelte';
	import UserAnalyticsOverviewTopAccommodationsLoading from './loading/user-analytics-overview-top-accommodations-loading.svelte';
	import UserAnalyticsOverviewTopAccommodationsError from './error/user-analytics-overview-top-accommodations-error.svelte';

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

	const topAccommodationsQuery = useQuery(
		api.pages.userAnalytics.queries.fetchUserAnalyticsTopAccommodations
			.fetchUserAnalyticsTopAccommodations,
		() => ({})
	);

	const isLoading = $derived(
		topAccommodationsQuery.data === undefined && !topAccommodationsQuery.error
	);
	const hasError = $derived(Boolean(topAccommodationsQuery.error));
	const topAccommodations = $derived(topAccommodationsQuery.data ?? []);

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

{#if isLoading}
	<UserAnalyticsOverviewTopAccommodationsLoading />
{:else if hasError}
	<UserAnalyticsOverviewTopAccommodationsError />
{:else}
	<section class="flex min-w-0 flex-col gap-3" aria-labelledby="top-accommodations-title">
		<div>
			<h2 id="top-accommodations-title" class="text-lg font-semibold tracking-tight">
				Top accommodations
			</h2>
			<p class="text-sm text-muted-foreground">
				Stays creating the strongest guest and reservation activity.
			</p>
		</div>

		<DataTable
			data={topAccommodations}
			{columns}
			getRowId={(row) => row.id}
			customCells={{
				action: actionCell
			}}
			showPagination={false}
		/>
	</section>
{/if}
