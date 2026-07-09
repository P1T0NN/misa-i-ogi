<script lang="ts" module>
	// TYPES
	import type { FunctionReference } from 'convex/server';

	/** The minimal shape a row is reduced to for rendering + selection. */
	export type SearchDialogItem = { id: string; name: string; city?: string | null };

	/**
	 * A Convex search query the dialog can drive. It receives `{ search, paginationOpts }`
	 * and returns a `{ page }` of documents — matches the shape of `createSearchQuery`.
	 */
	export type SearchDialogQuery<TDoc> = FunctionReference<
		'query',
		'public',
		Record<string, unknown>,
		{ page: TDoc[]; isDone?: boolean; continueCursor?: string }
	>;
</script>

<script lang="ts" generics="TDoc extends { _id: string }">
	// LIBRARIES
	import { useQuery } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';
	import { cn } from '@/shared/utils/utils.js';

	// COMPONENTS
	import Dialog from '@/shared/components/ui/dialog/dialog.svelte';
	import { Button, buttonVariants } from '@/shared/components/ui/button/index.js';
	import { Input } from '@/shared/components/ui/input/index.js';
	import { Spinner } from '@/shared/components/ui/spinner/index.js';

	// UTILS
	import { getSearchInputErrorMessage } from '@/shared/components/ui/search-input/searchInputUtils.js';

	// LUCIDE ICONS
	import SearchIcon from '@lucide/svelte/icons/search';
	import CheckIcon from '@lucide/svelte/icons/check';

	/**
	 * Universal search-and-pick dialog. Instead of loading a list up front, it shows a
	 * search box and queries `fetchQuery` (a Convex search query) as the user types.
	 * Single-select by default; pass `multiple` for a multi-select with a Done footer.
	 */
	let {
		inputId,
		fetchQuery,
		mapItem,
		value,
		setValue,
		multiple = false,
		showId = false,
		selectLabel,
		changeLabel,
		dialogTitle,
		placeholder,
		minChars = 2,
		maxResults = 20
	}: {
		inputId: string;
		fetchQuery: SearchDialogQuery<TDoc>;
		/** Reduce a fetched document to the row shape the dialog renders. */
		mapItem: (doc: TDoc) => SearchDialogItem;
		value: string | string[];
		setValue: (next: unknown) => void;
		multiple?: boolean;
		/** Admin flow: show the raw id under each row and selected chip. */
		showId?: boolean;
		selectLabel: string;
		changeLabel: string;
		dialogTitle: string;
		placeholder: string;
		minChars?: number;
		maxResults?: number;
	} = $props();

	let open = $state(false);
	let searchTerm = $state('');
	let debounced = $state('');
	/** Remembers labels of picked rows so they survive close / new searches. */
	let selectedCache = $state<Record<string, SearchDialogItem>>({});

	const selectedIds = $derived(
		multiple
			? Array.isArray(value)
				? value
				: []
			: typeof value === 'string' && value
				? [value]
				: []
	);
	const hasSelection = $derived(selectedIds.length > 0);

	// Debounce the term fed to the query so we don't fire on every keystroke.
	$effect(() => {
		const next = searchTerm;
		const timer = setTimeout(() => (debounced = next), 250);
		return () => clearTimeout(timer);
	});

	const trimmed = $derived(debounced.trim());
	const canSearch = $derived(trimmed.length >= minChars);

	// `fetchQuery` is fixed for the lifetime of a picker instance (the parent derives it
	// once from `forAdmin`, which never toggles), and `useQuery` has no reactive form for
	// the query ref — only the args getter below re-runs. Capturing the initial ref is correct.
	// svelte-ignore state_referenced_locally
	const resultsQuery = useQuery(fetchQuery, () =>
		open && canSearch
			? { search: trimmed, paginationOpts: { numItems: maxResults, cursor: null } }
			: 'skip'
	);

	const rows = $derived.by((): (SearchDialogItem & { number: number })[] => {
		const page = (resultsQuery.data?.page ?? []) as TDoc[];
		return page.map((doc, i) => ({ ...mapItem(doc), number: i + 1 }));
	});
	const loading = $derived(
		open && canSearch && resultsQuery.isLoading && resultsQuery.data === undefined
	);
	const errorMessage = $derived(
		resultsQuery.error ? getSearchInputErrorMessage(resultsQuery.error) : null
	);

	const displays = $derived.by((): SearchDialogItem[] =>
		selectedIds.map((id) => selectedCache[id] ?? rows.find((r) => r.id === id) ?? { id, name: id })
	);

	function pick(item: SearchDialogItem) {
		selectedCache[item.id] = { id: item.id, name: item.name, city: item.city };
		if (multiple) {
			const next = selectedIds.includes(item.id)
				? selectedIds.filter((id) => id !== item.id)
				: [...selectedIds, item.id];
			setValue(next);
		} else {
			setValue(item.id);
			open = false;
		}
	}
</script>

<div class="flex w-full flex-col gap-2">
	{#if hasSelection}
		<div class="flex w-full flex-col gap-2" aria-live="polite">
			{#each displays as display (display.id)}
				<div
					class="flex w-full flex-col gap-0.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5"
				>
					<span class="leading-snug font-medium text-primary">{display.name}</span>
					{#if display.city}
						<span class="text-xs leading-snug text-muted-foreground">{display.city}</span>
					{/if}
					{#if showId}
						<span class="font-mono text-xs leading-snug text-muted-foreground">{display.id}</span>
					{/if}
				</div>
			{/each}
		</div>
		<button
			type="button"
			class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
			onclick={() => (open = true)}
		>
			{changeLabel}
		</button>
	{:else}
		<button
			type="button"
			class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
			onclick={() => (open = true)}
		>
			{selectLabel}
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
		<h2 id="{inputId}-dialog-title" class="mb-3 font-serif text-2xl leading-tight text-foreground">
			{dialogTitle}
		</h2>
		<div class="relative">
			<SearchIcon
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				aria-hidden="true"
			/>
			<Input
				id={inputId}
				bind:value={searchTerm}
				{placeholder}
				autocomplete="off"
				class="h-10 pl-9"
				aria-controls="{inputId}-results"
			/>
		</div>
	</div>

	<div
		id="{inputId}-results"
		class="min-h-0 flex-1 overflow-y-auto px-2 py-2"
		role="listbox"
		aria-multiselectable={multiple ? 'true' : undefined}
		aria-labelledby="{inputId}-dialog-title"
	>
		{#if errorMessage}
			<p class="px-3 py-10 text-center text-sm text-destructive">{errorMessage}</p>
		{:else if !canSearch}
			<p class="px-3 py-10 text-center text-sm text-muted-foreground">{m['SearchDialog.hint']()}</p>
		{:else if loading}
			<div class="flex items-center justify-center gap-2 py-10 text-muted-foreground">
				<Spinner class="size-4" />
				<span class="text-sm">{m['SearchDialog.loading']()}</span>
			</div>
		{:else if rows.length === 0}
			<p class="px-3 py-10 text-center text-sm text-muted-foreground">
				{m['SearchDialog.noResults']()}
			</p>
		{:else}
			<ul class="flex flex-col gap-0.5">
				{#each rows as row (row.id)}
					{@const selected = selectedIds.includes(row.id)}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={selected}
							class={cn(
								'flex w-full items-baseline gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
								selected && 'bg-accent'
							)}
							onclick={() => pick(row)}
						>
							<span class="shrink-0 text-muted-foreground tabular-nums">{row.number}.</span>
							<span class="flex min-w-0 flex-1 flex-col gap-0.5">
								<span class="leading-snug font-medium">{row.name}</span>
								{#if row.city}
									<span class="text-xs leading-snug text-muted-foreground">{row.city}</span>
								{/if}
								{#if showId}
									<span class="font-mono text-xs leading-snug text-muted-foreground">{row.id}</span>
								{/if}
							</span>
							{#if multiple && selected}
								<CheckIcon class="size-4 shrink-0 self-center text-primary" aria-hidden="true" />
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	{#if multiple}
		<div class="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3">
			<span class="text-sm text-muted-foreground">
				{m['SearchDialog.selectedCount']({ count: selectedIds.length })}
			</span>
			<Button type="button" size="sm" onclick={() => (open = false)}>
				{m['SearchDialog.done']()}
			</Button>
		</div>
	{/if}
</Dialog>
