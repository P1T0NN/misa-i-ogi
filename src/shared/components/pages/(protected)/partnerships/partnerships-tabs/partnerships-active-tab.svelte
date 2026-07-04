<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// FEATURES
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// COMPONENTS
	import DataTable from '@/shared/components/ui/data-table/data-table.svelte';
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import PartnershipsTabEmpty from '../empty/partnerships-tab-empty.svelte';
	import PartnershipSetBenefitButton from './partnership-set-benefit-button.svelte';
	import RevokePartnershipDialog from '@/features/partnerships/components/revoke-partnership-dialog.svelte';

	// TYPES
	import type { typesPartnershipMyItem } from '@/features/partnerships/types/partnershipsTypes';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	interface Props {
		rows: typesPartnershipMyItem[];
	}

	let { rows }: Props = $props();

	const columns: ColumnDef<typesPartnershipMyItem>[] = [
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
			accessor: (r) => r.benefit ?? '',
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

{#if rows.length === 0}
	<PartnershipsTabEmpty tab="active" />
{:else}
	<DataTable
		caption={m['PartnershipsPage.PartnershipsActiveTab.caption']()}
		data={rows}
		{columns}
		getRowId={(r) => String(r.partnershipId)}
		customCells={{
			venue: venueCell,
			benefit: benefitCell,
			owner: ownerCell,
			actions: actionsCell
		}}
		showPagination={false}
	/>
{/if}

{#snippet venueCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	<div class="flex min-w-0 flex-col gap-0.5">
		<span class="truncate font-medium">{row.hospitalityName}</span>
		<span class="text-xs text-muted-foreground">
			{labelHospitalityType(row.hospitalityType)} · {row.hospitalityCity}
		</span>
	</div>
{/snippet}

{#snippet benefitCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	{#if row.benefit}
		<Badge variant="success">{row.benefit}</Badge>
	{:else if row.isOwnHospitality}
		<PartnershipSetBenefitButton partnershipId={row.partnershipId} />
	{:else}
		<span class="text-sm text-muted-foreground">
			{m['PartnershipsPage.PartnershipsActiveTab.benefitNone']()}
		</span>
	{/if}
{/snippet}

{#snippet ownerCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	{#if row.isOwnHospitality}
		<Badge variant="outline">{m['PartnershipsPage.PartnershipsActiveTab.ownerYours']()}</Badge>
	{:else}
		<Badge variant="secondary">{m['PartnershipsPage.PartnershipsActiveTab.ownerPartner']()}</Badge>
	{/if}
{/snippet}

{#snippet actionsCell({ row }: DataTableCellSnippetProps<typesPartnershipMyItem>)}
	<RevokePartnershipDialog
		partnershipId={row.partnershipId}
		accommodationName={row.accommodationName}
		hospitalityName={row.hospitalityName}
	/>
{/snippet}
