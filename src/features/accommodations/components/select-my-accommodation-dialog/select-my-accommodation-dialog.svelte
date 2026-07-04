<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';
	import { cn } from '@/shared/utils/utils.js';

	// CONFIG
	import { PAGINATION_DATA } from '@/shared/config';

	// COMPONENTS
	import Dialog from '@/shared/components/ui/dialog/dialog.svelte';
	import DataList from '@/shared/components/ui/data-list/data-list.svelte';
	import { buttonVariants } from '@/shared/components/ui/button/index.js';
	import SelectMyAccommodationDialogLoading from '@/features/accommodations/components/select-my-accommodation-dialog/select-my-accommodation-dialog-loading.svelte';
	import SelectMyAccommodationDialogError from '@/features/accommodations/components/select-my-accommodation-dialog/select-my-accommodation-dialog-error.svelte';
	import SelectMyAccommodationDialogEmpty from '@/features/accommodations/components/select-my-accommodation-dialog/select-my-accommodation-dialog-empty.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	type AccommodationPickerRow = Pick<Doc<'accommodations'>, '_id' | 'name' | 'city'>;

	/**
	 * Owner-scoped accommodation picker for custom partnerships and similar flows.
	 * Fetches on first open, then keeps the subscription so reopening shows cached rows.
	 */
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
	/** After first open, stay subscribed so cached rows survive dialog close. */
	let hasLoadedOnce = $state(false);
	/** Keeps name/city visible after close when the row is not in the current page. */
	let selectedRow = $state<AccommodationPickerRow | null>(null);

	function openDialog() {
		hasLoadedOnce = true;
		open = true;
	}

	const accommodationsQuery = useQuery(
		api.tables.accommodations.queries.fetchMyAccommodations.fetchMyAccommodations,
		() =>
			hasLoadedOnce
				? {
						paginationOpts: { numItems: PAGINATION_DATA.DEFAULT_PAGE_SIZE, cursor: null }
					}
				: 'skip',
		() => ({ keepPreviousData: true })
	);

	const rows = $derived.by((): AccommodationPickerRow[] =>
		[...(accommodationsQuery.data?.page ?? [])].sort((a, b) => a.name.localeCompare(b.name))
	);
	const isLoading = $derived(
		open && accommodationsQuery.isLoading && accommodationsQuery.data === undefined
	);
	const hasError = $derived(open && accommodationsQuery.error !== undefined);
	const hasSelection = $derived(Boolean(value));

	const display = $derived.by((): AccommodationPickerRow | null => {
		if (!value) return null;
		if (selectedRow?._id === value) return selectedRow;
		return rows.find((row) => row._id === value) ?? null;
	});

	$effect(() => {
		if (!value) selectedRow = null;
	});

	function selectAccommodation(row: AccommodationPickerRow) {
		selectedRow = row;
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
			<span class="leading-snug font-medium text-primary">{display.name}</span>
			<span class="text-xs leading-snug text-muted-foreground">{display.city}</span>
		</div>
		<button
			type="button"
			class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
			onclick={openDialog}
		>
			{m['SelectMyAccommodationDialog.modifyAccommodation']()}
		</button>
	{:else}
		<button
			type="button"
			class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
			onclick={openDialog}
		>
			{m['SelectMyAccommodationDialog.selectAccommodation']()}
		</button>
	{/if}
</div>

<Dialog
	bind:open
	hideHeader
	class="flex h-[min(48rem,90vh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
	contentClass="flex h-full max-h-none min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0"
>
	<div class="shrink-0 border-b border-border px-4 py-4 pr-12">
		<h2 id="{inputId}-dialog-title" class="font-serif text-2xl leading-tight text-foreground">
			{m['SelectMyAccommodationDialog.dialogTitle']()}
		</h2>
	</div>

	<div
		class="min-h-0 flex-1 overflow-y-auto px-2 py-2"
		role="listbox"
		aria-labelledby="{inputId}-dialog-title"
	>
		<DataList
			class="gap-0"
			listClass="flex flex-col gap-0.5"
			items={rows}
			getItemKey={(row) => row._id}
			{isLoading}
			{hasError}
			isEmpty={rows.length === 0}
		>
			{#snippet item({ item: row })}
				<button
					type="button"
					role="option"
					aria-selected={value === row._id}
					class={cn(
						'flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
						value === row._id && 'bg-accent'
					)}
					onclick={() => selectAccommodation(row)}
				>
					<span class="leading-snug font-medium">{row.name}</span>
					<span class="text-xs leading-snug text-muted-foreground">{row.city}</span>
				</button>
			{/snippet}

			{#snippet loading()}
				<SelectMyAccommodationDialogLoading />
			{/snippet}

			{#snippet error()}
				<SelectMyAccommodationDialogError />
			{/snippet}

			{#snippet empty()}
				<SelectMyAccommodationDialogEmpty />
			{/snippet}
		</DataList>
	</div>
</Dialog>
