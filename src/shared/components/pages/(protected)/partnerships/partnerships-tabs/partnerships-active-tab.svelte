<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { CUSTOM_PARTNERSHIP_ENABLED, PAGINATION_DATA } from '@/shared/config';

	// FEATURES
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// COMPONENTS
	import ConvexDataTable from '@/shared/components/ui/data-table/convex-data-table.svelte';
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import RevokePartnershipDialog from '@/features/partnerships/components/revoke-partnership-dialog.svelte';
	import PartnershipsPlatformTable from './partnerships-platform-table.svelte';

	// TYPES
	import type { typesPartnershipMyItem } from '@/features/partnerships/types/partnershipsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	const customColumns: ColumnDef<typesPartnershipMyItem>[] = [
		{
			id: 'venue',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnVenue'](),
			accessor: (r) => r.hospitalityName,
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'accommodation',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnAccommodation'](),
			accessor: (r) => r.accommodationName,
			hideBelow: 'sm'
		},
		{
			id: 'benefit',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnBenefit'](),
			accessor: (r) => r.benefit,
			wrap: true
		},
		{
			id: 'owner',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnOwner'](),
			accessor: (r) => r.isOwnHospitality,
			hideBelow: 'md',
			wrap: true
		},
		{
			id: 'created',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnCreated'](),
			accessor: (r) => new Date(r.createdAt).toLocaleDateString(),
			hideBelow: 'lg'
		},
		{
			id: 'actions',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnActions'](),
			accessor: () => '',
			wrap: true
		}
	];
</script>

{#if CUSTOM_PARTNERSHIP_ENABLED}
	<ConvexDataTable
		caption={m['PartnershipsPage.PartnershipsActiveTab.captionCustom']()}
		query={api.tables.partnerships.queries.fetchActivePartnershipsSafe.fetchActivePartnershipsSafe}
		optimizationStrategy="cursor"
		pageSize={PAGINATION_DATA.MAX_PAGE_SIZE}
		columns={customColumns}
		getRowId={(r) => String(r.partnershipId)}
		customCells={{
			venue: customVenueCell,
			benefit: customBenefitCell,
			owner: customOwnerCell,
			actions: customActionsCell
		}}
	/>
{/if}

<PartnershipsPlatformTable />

{#snippet customVenueCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	<div class="flex min-w-0 flex-col gap-0.5">
		<span class="truncate font-medium">{row.hospitalityName}</span>
		<span class="text-xs text-muted-foreground">
			{labelHospitalityType(row.hospitalityType)} · {row.hospitalityCity}
		</span>
	</div>
{/snippet}

{#snippet customBenefitCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	<Badge variant="success">{row.benefit}</Badge>
{/snippet}

{#snippet customOwnerCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	{#if row.isOwnHospitality}
		<Badge variant="outline">{m['PartnershipsPage.PartnershipsActiveTab.ownerYours']()}</Badge>
	{:else}
		<Badge variant="secondary">{m['PartnershipsPage.PartnershipsActiveTab.ownerPartner']()}</Badge>
	{/if}
{/snippet}

{#snippet customActionsCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	<RevokePartnershipDialog
		partnershipId={row.partnershipId}
		accommodationName={row.accommodationName}
		hospitalityName={row.hospitalityName}
	/>
{/snippet}
