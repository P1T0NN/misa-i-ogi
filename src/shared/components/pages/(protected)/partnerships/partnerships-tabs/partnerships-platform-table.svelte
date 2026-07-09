<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PAGINATION_DATA } from '@/shared/config';

	// FEATURES
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// COMPONENTS
	import ConvexDataTable from '@/shared/components/ui/data-table/convex-data-table.svelte';
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';

	const platformColumns: ColumnDef<Doc<'hospitalities'>>[] = [
		{
			id: 'venue',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnVenue'](),
			accessor: (r) => r.name,
			cellClass: 'font-medium',
			wrap: true
		},
		{
			id: 'accommodation',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnAccommodation'](),
			accessor: () => m['PartnershipsPage.PartnershipsActiveTab.allAccommodations'](),
			hideBelow: 'sm',
			wrap: true
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
			accessor: () => 'platform',
			hideBelow: 'md',
			wrap: true
		},
		{
			id: 'created',
			header: m['PartnershipsPage.PartnershipsActiveTab.columnCreated'](),
			accessor: (r) => new Date(r._creationTime).toLocaleDateString(),
			hideBelow: 'lg'
		}
	];
</script>

<ConvexDataTable
	caption={m['PartnershipsPage.PartnershipsActiveTab.captionPlatform']()}
	query={api.tables.hospitalities.queries.fetchActivePlatformHospitalities
		.fetchActivePlatformHospitalities}
	optimizationStrategy="cursor"
	pageSize={PAGINATION_DATA.MAX_PAGE_SIZE}
	columns={platformColumns}
	getRowId={(r) => String(r._id)}
	customCells={{
		venue: platformVenueCell,
		benefit: platformBenefitCell,
		owner: platformOwnerCell
	}}
/>

{#snippet platformVenueCell({ row }: DataTableCellSnippetProps<Doc<'hospitalities'>>)}
	<div class="flex min-w-0 flex-col gap-0.5">
		<span class="truncate font-medium">{row.name}</span>
		<span class="text-xs text-muted-foreground">
			{labelHospitalityType(row.type)} · {row.city}
		</span>
	</div>
{/snippet}

{#snippet platformBenefitCell({ row }: DataTableCellSnippetProps<Doc<'hospitalities'>>)}
	<Badge variant="success">{row.benefit}</Badge>
{/snippet}

{#snippet platformOwnerCell()}
	<Badge variant="secondary">{m['PartnershipsPage.PartnershipsActiveTab.ownerPlatform']()}</Badge>
{/snippet}
