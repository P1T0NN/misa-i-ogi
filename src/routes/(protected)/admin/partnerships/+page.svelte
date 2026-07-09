<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS, UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

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

	const queryArgs = $derived({
		sortColumn: sortColumn as 'accommodation' | 'hospitality' | 'created' | undefined,
		sortDirection
	});

	const columns: ColumnDef<Doc<'partnerships'>>[] = [
		{
			id: 'accommodation',
			header: m['AdminPartnershipsPage.columnAccommodation'](),
			accessor: (r) => r.accommodationId,
			sortable: true,
			hasCopy: true,
			cellClass: 'max-w-[10rem] font-mono text-xs md:max-w-xs'
		},
		{
			id: 'accommodationScanToken',
			header: m['AdminPartnershipsPage.columnAccommodationScanToken'](),
			accessor: (r) => r.accommodationScanToken,
			hasCopy: true,
			cellClass: 'max-w-[10rem] font-mono text-xs md:max-w-xs',
			hideBelow: 'md'
		},
		{
			id: 'hospitality',
			header: m['AdminPartnershipsPage.columnHospitality'](),
			accessor: (r) => r.hospitalityId,
			sortable: true,
			hasCopy: true,
			cellClass: 'max-w-[10rem] font-mono text-xs md:max-w-xs'
		},
		{
			id: 'benefit',
			header: m['AdminPartnershipsPage.columnBenefit'](),
			accessor: (r) => r.benefit,
			hideBelow: 'sm'
		},
		{
			id: 'created',
			header: m['AdminPartnershipsPage.columnCreated'](),
			accessor: (r) => new Date(r._creationTime).toLocaleString(),
			sortable: true,
			hideBelow: 'lg'
		}
	];
</script>

<SvelteHead
	title={m['AdminPartnershipsPage.SEO.title']()}
	description={m['AdminPartnershipsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-4 p-4 md:p-6">
	<header
		class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
	>
		<div class="flex max-w-3xl min-w-0 flex-col gap-1">
			<h1 class="text-2xl font-semibold tracking-tight">{m['AdminPartnershipsPage.title']()}</h1>
			<p class="text-sm leading-relaxed text-muted-foreground">
				{m['AdminPartnershipsPage.description']()}
			</p>
		</div>
		<Button href={ADMIN_PAGE_ENDPOINTS.PARTNERSHIP_ADD} class="w-full shrink-0 sm:w-auto">
			<PlusIcon data-icon="inline-start" />
			{m['AdminPartnershipsPage.addPartnership']()}
		</Button>
	</header>

	<ConvexDataTable
		caption={m['AdminPartnershipsPage.caption']()}
		query={api.tables.partnerships.queries.fetchAllPartnershipsAdmin.fetchAllPartnershipsAdmin}
		{queryArgs}
		optimizationStrategy="cursor"
		getRowId={(r) => r._id}
		{columns}
		customCells={{
			accommodation: accommodationCell,
			hospitality: hospitalityCell,
			benefit: benefitCell
		}}
		bind:sortColumn
		bind:sortDirection
		selectable
		deleteMutation={api.tables.partnerships.mutations.deletePartnerships.deletePartnerships}
	/>
</section>

{#snippet accommodationCell({ row }: DataTableCellSnippetProps<Doc<'partnerships'>>)}
	<Link
		href={UNPROTECTED_PAGE_ENDPOINTS.ACTIVATE.replace(':token', row.accommodationScanToken)}
		class="font-mono text-xs text-primary underline-offset-4 hover:underline"
	>
		{row.accommodationId}
	</Link>
{/snippet}

{#snippet hospitalityCell({ row }: DataTableCellSnippetProps<Doc<'partnerships'>>)}
	<Link
		href={UNPROTECTED_PAGE_ENDPOINTS.HOSPITALITY.replace(':id', row.hospitalityId)}
		class="font-mono text-xs text-primary underline-offset-4 hover:underline"
	>
		{row.hospitalityId}
	</Link>
{/snippet}

{#snippet benefitCell({ row }: DataTableCellSnippetProps<Doc<'partnerships'>>)}
	<Badge variant="secondary">{row.benefit}</Badge>
{/snippet}
