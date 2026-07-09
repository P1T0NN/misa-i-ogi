<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PAGINATION_DATA } from '@/shared/config';

	// COMPONENTS
	import ConvexDataTable from '@/shared/components/ui/data-table/convex-data-table.svelte';
	import PartnershipRequestItem from './partnership-request-item.svelte';

	// TYPES
	import type { typesPartnershipRequestItem } from '@/features/partnerships/types/partnershipsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	const columns: ColumnDef<typesPartnershipRequestItem>[] = [
		{
			id: 'request',
			header: m['PartnershipsPage.PartnershipsReceivedTab.columnRequest'](),
			accessor: () => '',
			wrap: true
		}
	];
</script>

<ConvexDataTable
	caption={m['PartnershipsPage.PartnershipsReceivedTab.caption']()}
	query={api.tables.partnershipRequests.queries.fetchPartnershipsRequestsReceived
		.fetchPartnershipsRequestsReceived}
	optimizationStrategy="cursor"
	pageSize={PAGINATION_DATA.DEFAULT_PAGE_SIZE}
	{columns}
	getRowId={(r) => String(r.requestId)}
	customCells={{
		request: requestCell
	}}
/>

{#snippet requestCell({ row }: DataTableCellSnippetProps<typesPartnershipRequestItem>)}
	<PartnershipRequestItem
		requestId={row.requestId}
		accommodationName={row.accommodationName}
		requestedAt={row.requestedAt}
	/>
{/snippet}
