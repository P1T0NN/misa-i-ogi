<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS, UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexDataTable from '@/shared/components/ui/data-table/convex-data-table.svelte';
	import Link from '@/shared/components/ui/link/link.svelte';
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import AccommodationQrDialog from '@/features/accommodations/components/accommodation-qr-dialog/accommodation-qr-dialog.svelte';

	// DATA
	import { labelAccommodationType } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type {
		ColumnDef,
		DataTableCellSnippetProps
	} from '@/shared/components/ui/data-table/types.js';
	import type { Doc } from '@/convex/_generated/dataModel';

	// LUCIDE ICONS
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import PlusIcon from '@lucide/svelte/icons/plus';

	let sortColumn = $state<string | undefined>(undefined);
	let sortDirection = $state<'asc' | 'desc' | undefined>(undefined);
	let qrDialogOpen = $state(false);
	let qrDialogTarget = $state<{ name: string; scanToken: string } | null>(null);

	const queryArgs = $derived({});

	function cityLine(row: Doc<'accommodations'>) {
		return [row.city, row.country].filter(Boolean).join(', ');
	}

	function openQrDialog(row: Doc<'accommodations'>) {
		qrDialogTarget = { name: row.name, scanToken: row.scanToken };
		qrDialogOpen = true;
	}

	const columns: ColumnDef<Doc<'accommodations'>>[] = [
		{
			id: 'name',
			header: m['AdminAccommodationsPage.columnName'](),
			accessor: (r) => r.name,
			sortable: true
		},
		{
			id: 'type',
			header: m['AdminAccommodationsPage.columnType'](),
			accessor: (r) => labelAccommodationType(r.type),
			sortable: true,
			hideBelow: 'md'
		},
		{
			id: 'city',
			header: m['AdminAccommodationsPage.columnCity'](),
			accessor: (r) => cityLine(r),
			sortable: true,
			hideBelow: 'sm'
		},
		{
			id: 'scanToken',
			header: m['AdminAccommodationsPage.columnScanToken'](),
			accessor: (r) => r.scanToken,
			sortable: true,
			hideBelow: 'md',
			hasCopy: true,
			cellClass: 'max-w-[10rem] md:max-w-xs font-mono text-xs'
		},
		{
			id: 'qr',
			header: m['AdminAccommodationsPage.columnQr'](),
			accessor: () => '',
			hideBelow: 'sm'
		},
		{
			id: 'address',
			header: m['AdminAccommodationsPage.columnAddress'](),
			accessor: (r) => r.address,
			hideBelow: 'lg',
			cellClass: 'max-w-[14rem] text-muted-foreground',
			wrap: true
		},
		{
			id: 'status',
			header: m['AdminAccommodationsPage.columnStatus'](),
			accessor: (r) => r.isActive,
			hideBelow: 'md'
		},
		{
			id: 'created',
			header: m['AdminAccommodationsPage.columnCreated'](),
			accessor: (r) => new Date(r._creationTime).toLocaleString(),
			sortable: true,
			hideBelow: 'lg'
		}
	];
</script>

<SvelteHead
	title={m['AdminAccommodationsPage.SEO.title']()}
	description={m['AdminAccommodationsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-4 p-4 md:p-6">
	<header
		class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
	>
		<div class="flex max-w-3xl min-w-0 flex-col gap-1">
			<h1 class="text-2xl font-semibold tracking-tight">{m['AdminAccommodationsPage.title']()}</h1>
			<p class="text-sm leading-relaxed text-muted-foreground">
				{m['AdminAccommodationsPage.description']()}
			</p>
		</div>
		<Button href={ADMIN_PAGE_ENDPOINTS.ACCOMMODATION_ADD} class="w-full shrink-0 sm:w-auto">
			<PlusIcon data-icon="inline-start" />
			{m['AdminAccommodationsPage.addAccommodation']()}
		</Button>
	</header>

	<ConvexDataTable
		caption={m['AdminAccommodationsPage.caption']()}
		query={api.tables.accommodations.queries.fetchAllAccommodations.fetchAllAccommodations}
		{queryArgs}
		optimizationStrategy="cursor"
		getRowId={(r) => r._id}
		{columns}
		customCells={{ name: nameCell, qr: qrCell, status: statusCell }}
		bind:sortColumn
		bind:sortDirection
		selectable
		deleteMutation={api.tables.accommodations.mutations.deleteAccommodations.deleteAccommodations}
	/>
</section>

{#if qrDialogTarget}
	<AccommodationQrDialog
		bind:open={qrDialogOpen}
		accommodationName={qrDialogTarget.name}
		scanToken={qrDialogTarget.scanToken}
	/>
{/if}

{#snippet qrCell({ row }: DataTableCellSnippetProps<Doc<'accommodations'>>)}
	<Button
		type="button"
		variant="outline"
		size="icon-sm"
		aria-label={m['AdminAccommodationsPage.openQr']({ name: row.name })}
		title={m['AdminAccommodationsPage.openQr']({ name: row.name })}
		onclick={() => openQrDialog(row)}
	>
		<QrCodeIcon />
	</Button>
{/snippet}

{#snippet nameCell({ row }: DataTableCellSnippetProps<Doc<'accommodations'>>)}
	<Link
		href={UNPROTECTED_PAGE_ENDPOINTS.ACTIVATE.replace(':token', row.scanToken)}
		class="font-medium text-primary underline-offset-4 hover:underline"
	>
		{row.name}
	</Link>
{/snippet}

{#snippet statusCell({ row }: DataTableCellSnippetProps<Doc<'accommodations'>>)}
	{#if row.isActive}
		<Badge variant="success">{m['AdminAccommodationsPage.statusActive']()}</Badge>
	{:else}
		<Badge variant="secondary">{m['AdminAccommodationsPage.statusInactive']()}</Badge>
	{/if}
{/snippet}
