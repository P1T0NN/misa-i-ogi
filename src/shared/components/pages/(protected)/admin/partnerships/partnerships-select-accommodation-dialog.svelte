<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';
	import { cn } from '@/shared/utils/utils.js';

	// COMPONENTS
	import Dialog from '@/shared/components/ui/dialog/dialog.svelte';
	import { buttonVariants } from '@/shared/components/ui/button/index.js';
	import PartnershipsSelectAccommodationDialogLoading from './loading/partnerships-select-accommodation-dialog-loading.svelte';
	import PartnershipsSelectAccommodationDialogEmpty from './empty/partnerships-select-accommodation-dialog-empty.svelte';
	import PartnershipsSelectAccommodationDialogItem from './partnerships-select-accommodation-dialog-item.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	/** Max rows loaded in the picker (single cursor page). */
	const PICKER_PAGE_SIZE = 100;

	let {
		inputId,
		value = '',
		setValue
	}: {
		inputId: string;
		value?: string;
		setValue: (next: unknown) => void;
	} = $props();

	let open = $state(false);

	const accommodationsQuery = useQuery(
		api.tables.accommodations.queries.fetchAllAccommodations.fetchAllAccommodations,
		() =>
			open || value
				? {
						sortColumn: 'name' as const,
						sortDirection: 'asc' as const,
						paginationOpts: { numItems: PICKER_PAGE_SIZE, cursor: null }
					}
				: 'skip'
	);

	const rows = $derived.by((): Doc<'accommodations'>[] => accommodationsQuery.data?.page ?? []);
	const isLoading = $derived(
		accommodationsQuery.isLoading && accommodationsQuery.data === undefined
	);
	const isTruncated = $derived(accommodationsQuery.data?.isDone === false);
	const hasSelection = $derived(Boolean(value));

	const display = $derived.by(() => {
		if (!value) return null;
		const match = rows.find((row) => row._id === value);
		if (match) return { name: match.name, id: match._id };
		return { name: null, id: value };
	});

	function selectAccommodation(row: Doc<'accommodations'>) {
		setValue(row._id);
		open = false;
	}
</script>

<div class="flex w-full flex-col gap-2">
	{#if hasSelection && display}
		<div
			class="flex w-full flex-col gap-0.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5"
			aria-live="polite"
		>
			{#if display.name}
				<span class="leading-snug font-medium text-primary">{display.name}</span>
			{/if}
			<span class="font-mono text-xs leading-snug text-muted-foreground">{display.id}</span>
		</div>
		<button
			type="button"
			class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
			onclick={() => {
				open = true;
			}}
		>
			{m['AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.modifyAccommodation']()}
		</button>
	{:else}
		<button
			type="button"
			class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
			onclick={() => {
				open = true;
			}}
		>
			{m['AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.selectAccommodation']()}
		</button>
	{/if}
</div>

<Dialog
	bind:open
	hideHeader
	class="flex max-h-[min(42rem,85vh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
	contentClass="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0"
>
	<div class="shrink-0 border-b border-border px-4 py-4 pr-12">
		<h2 id="{inputId}-dialog-title" class="font-serif text-2xl leading-tight text-foreground">
			{m['AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.selectAccommodationDialogTitle']()}
		</h2>
	</div>

	<div
		class="min-h-0 flex-1 overflow-y-auto px-2 py-2"
		role="listbox"
		aria-labelledby="{inputId}-dialog-title"
	>
		{#if isLoading}
			<PartnershipsSelectAccommodationDialogLoading />
		{:else if rows.length === 0}
			<PartnershipsSelectAccommodationDialogEmpty />
		{:else}
			<ul class="flex flex-col gap-0.5">
				{#each rows as row (row._id)}
					<PartnershipsSelectAccommodationDialogItem
						accommodation={row}
						selected={value === row._id}
						onSelect={() => selectAccommodation(row)}
					/>
				{/each}
			</ul>
		{/if}
	</div>

	{#if isTruncated && rows.length > 0}
		<p
			class="shrink-0 border-t border-border px-4 py-2 text-xs leading-relaxed text-muted-foreground"
		>
			{m['AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.selectAccommodationTruncated']({ count: rows.length })}
		</p>
	{/if}
</Dialog>
