<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PAGINATION_DATA } from '@/shared/config';

	// COMPONENTS
	import ConvexDataTable from '@/shared/components/ui/data-table/convex-data-table.svelte';
	import PartnershipStatusBadge from './partnership-status-badge.svelte';

	// TYPES
	import type { typesPartnershipRequestItem } from '@/features/partnerships/types/partnershipsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	const columns: ColumnDef<typesPartnershipRequestItem>[] = [
		{
			id: 'venue',
			header: m['PartnershipsPage.PartnershipsSentTab.columnVenue'](),
			accessor: (r) => r.hospitalityName ?? '',
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'sent',
			header: m['PartnershipsPage.PartnershipsSentTab.columnSent'](),
			accessor: (r) => new Date(r.requestedAt).toLocaleDateString(),
			hideBelow: 'sm'
		},
		{
			id: 'status',
			header: m['PartnershipsPage.PartnershipsSentTab.columnStatus'](),
			accessor: (r) => r.status,
			wrap: true
		}
	];
</script>

<ConvexDataTable
	caption={m['PartnershipsPage.PartnershipsSentTab.caption']()}
	query={api.tables.partnershipRequests.queries.fetchPartnershipsRequestsSent
		.fetchPartnershipsRequestsSent}
	optimizationStrategy="cursor"
	pageSize={PAGINATION_DATA.DEFAULT_PAGE_SIZE}
	{columns}
	getRowId={(r) => String(r.requestId)}
	customCells={{
		venue: venueCell,
		status: statusCell
	}}
/>

{#snippet venueCell({ row }: DataTableCellSnippetProps<typesPartnershipRequestItem>)}
	<span class="truncate font-medium">
		{row.hospitalityName ?? m['PartnershipsPage.PartnershipsSentTab.unknownVenue']()}
	</span>
{/snippet}

{#snippet statusCell({ row }: DataTableCellSnippetProps<typesPartnershipRequestItem>)}
	<PartnershipStatusBadge status={row.status} />
{/snippet}
