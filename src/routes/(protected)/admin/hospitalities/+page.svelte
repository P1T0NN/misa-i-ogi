<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS, UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// FEATURES
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexDataTable from '@/shared/components/ui/data-table/convex-data-table.svelte';
	import Link from '@/shared/components/ui/link/link.svelte';
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// TYPES
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';
	import type { Doc } from '@/convex/_generated/dataModel';

	// LUCIDE ICONS
	import PlusIcon from '@lucide/svelte/icons/plus';

	let sortColumn = $state<string | undefined>(undefined);
	let sortDirection = $state<'asc' | 'desc' | undefined>(undefined);

	const queryArgs = $derived({});

	function contactLine(row: Doc<'hospitalities'>) {
		return row.contactPhone || m['AdminHospitalitiesPage.contactNone']();
	}

	function cityLine(row: Doc<'hospitalities'>) {
		return [row.city, row.country].filter(Boolean).join(', ');
	}

	const columns: ColumnDef<Doc<'hospitalities'>>[] = [
		{
			id: 'name',
			header: m['AdminHospitalitiesPage.columnName'](),
			accessor: (r) => r.name,
			sortable: true
		},
		{
			id: 'type',
			header: m['AdminHospitalitiesPage.columnType'](),
			accessor: (r) => labelHospitalityType(r.type),
			sortable: true,
			hideBelow: 'md'
		},
		{
			id: 'city',
			header: m['AdminHospitalitiesPage.columnCity'](),
			accessor: (r) => cityLine(r),
			sortable: true,
			hideBelow: 'sm'
		},
		{
			id: 'contact',
			header: m['AdminHospitalitiesPage.columnContact'](),
			accessor: (r) => contactLine(r),
			hideBelow: 'md',
			cellClass: 'max-w-[12rem] text-muted-foreground text-sm'
		},
		{
			id: 'address',
			header: m['AdminHospitalitiesPage.columnAddress'](),
			accessor: (r) => r.address,
			hideBelow: 'lg',
			cellClass: 'max-w-[14rem] text-muted-foreground',
			wrap: true
		},
		{
			id: 'status',
			header: m['AdminHospitalitiesPage.columnStatus'](),
			accessor: (r) => r.isActive,
			hideBelow: 'md'
		},
		{
			id: 'created',
			header: m['AdminHospitalitiesPage.columnCreated'](),
			accessor: (r) => new Date(r._creationTime).toLocaleString(),
			sortable: true,
			hideBelow: 'lg'
		}
	];
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-4 p-4 md:p-6">
	<header
		class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
	>
		<div class="flex max-w-3xl min-w-0 flex-col gap-1">
			<h1 class="text-2xl font-semibold tracking-tight">{m['AdminHospitalitiesPage.title']()}</h1>
			<p class="text-sm leading-relaxed text-muted-foreground">
				{m['AdminHospitalitiesPage.description']()}
			</p>
		</div>
		<Button href={ADMIN_PAGE_ENDPOINTS.HOSPITALITY_ADD} class="w-full shrink-0 sm:w-auto">
			<PlusIcon data-icon="inline-start" />
			{m['AdminHospitalitiesPage.addHospitality']()}
		</Button>
	</header>

	<ConvexDataTable
		caption={m['AdminHospitalitiesPage.caption']()}
		query={api.tables.hospitalities.queries.fetchAllHospitalities.fetchAllHospitalities}
		{queryArgs}
		optimizationStrategy="cursor"
		getRowId={(r) => r._id}
		{columns}
		customCells={{ name: nameCell, status: statusCell }}
		bind:sortColumn
		bind:sortDirection
		selectable
		deleteMutation={api.tables.hospitalities.mutations.deleteHospitalities.deleteHospitalities}
	/>
</section>

{#snippet nameCell({ row }: DataTableCellSnippetProps<Doc<'hospitalities'>>)}
	<Link
		href={UNPROTECTED_PAGE_ENDPOINTS.HOSPITALITY.replace(':id', row._id)}
		class="font-medium text-primary underline-offset-4 hover:underline"
	>
		{row.name}
	</Link>
{/snippet}

{#snippet statusCell({ row }: DataTableCellSnippetProps<Doc<'hospitalities'>>)}
	{#if row.isActive}
		<Badge variant="success">{m['AdminHospitalitiesPage.statusActive']()}</Badge>
	{:else}
		<Badge variant="secondary">{m['AdminHospitalitiesPage.statusInactive']()}</Badge>
	{/if}
{/snippet}
