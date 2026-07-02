<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';
	import { cn } from '@/shared/utils/utils.js';

	// COMPONENTS
	import * as Dialog from '@/shared/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '@/shared/components/ui/button/index.js';
	import PartnershipsSelectHospitalityDialogLoading from './loading/partnerships-select-hospitality-dialog-loading.svelte';
	import PartnershipsSelectHospitalityDialogEmpty from './empty/partnerships-select-hospitality-dialog-empty.svelte';
	import PartnershipsSelectHospitalityDialogItem from './partnerships-select-hospitality-dialog-item.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	/** Max rows loaded in the picker (single cursor page). */
	const PICKER_PAGE_SIZE = 100;

	let {
		inputId,
		value = [],
		setValue
	}: {
		inputId: string;
		value?: string[];
		setValue: (next: unknown) => void;
	} = $props();

	let open = $state(false);

	const selectedIds = $derived(Array.isArray(value) ? value : []);

	const hospitalitiesQuery = useQuery(
		api.tables.hospitalities.queries.fetchAllHospitalities.fetchAllHospitalities,
		() =>
			open || selectedIds.length > 0
				? {
						sortColumn: 'name' as const,
						sortDirection: 'asc' as const,
						paginationOpts: { numItems: PICKER_PAGE_SIZE, cursor: null }
					}
				: 'skip'
	);

	const rows = $derived.by((): Doc<'hospitalities'>[] => hospitalitiesQuery.data?.page ?? []);
	const isLoading = $derived(hospitalitiesQuery.isLoading && hospitalitiesQuery.data === undefined);
	const isTruncated = $derived(hospitalitiesQuery.data?.isDone === false);
	const hasSelection = $derived(selectedIds.length > 0);

	const displays = $derived.by(() =>
		selectedIds.map((id) => {
			const match = rows.find((row) => row._id === id);
			return { name: match?.name ?? null, id };
		})
	);

	function toggleHospitality(row: Doc<'hospitalities'>) {
		const next = selectedIds.includes(row._id)
			? selectedIds.filter((id) => id !== row._id)
			: [...selectedIds, row._id];
		setValue(next);
	}
</script>

<Dialog.Root bind:open>
	<div class="flex w-full flex-col gap-2">
		{#if hasSelection}
			<div class="flex w-full flex-col gap-2" aria-live="polite">
				{#each displays as display (display.id)}
					<div
						class="flex w-full flex-col gap-0.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5"
					>
						{#if display.name}
							<span class="leading-snug font-medium text-primary">{display.name}</span>
						{/if}
						<span class="font-mono text-xs leading-snug text-muted-foreground">{display.id}</span>
					</div>
				{/each}
			</div>
			<button
				type="button"
				class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
				onclick={() => {
					open = true;
				}}
			>
				{m['AdminPartnershipAddPage.modifyHospitality']()}
			</button>
		{:else}
			<Dialog.Trigger type="button" class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
				{m['AdminPartnershipAddPage.selectHospitality']()}
			</Dialog.Trigger>
		{/if}
	</div>

	<Dialog.Content
		class="flex h-[min(42rem,85vh)] w-[min(calc(100vw-2rem),32rem)] flex-col gap-0 overflow-hidden p-0 sm:h-168 sm:w-lg"
	>
		<Dialog.Header class="shrink-0 border-b border-border px-4 py-4 pr-12">
			<Dialog.Title id="{inputId}-dialog-title">
				{m['AdminPartnershipAddPage.selectHospitalityDialogTitle']()}
			</Dialog.Title>
		</Dialog.Header>

		<div
			class="min-h-0 flex-1 overflow-y-auto px-2 py-2"
			role="listbox"
			aria-multiselectable="true"
			aria-labelledby="{inputId}-dialog-title"
		>
			{#if isLoading}
				<PartnershipsSelectHospitalityDialogLoading />
			{:else if rows.length === 0}
				<PartnershipsSelectHospitalityDialogEmpty />
			{:else}
				<ul class="flex flex-col gap-0.5">
					{#each rows as row (row._id)}
						<PartnershipsSelectHospitalityDialogItem
							hospitality={row}
							selected={selectedIds.includes(row._id)}
							onSelect={() => toggleHospitality(row)}
						/>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3">
			<span class="text-sm text-muted-foreground">
				{m['AdminPartnershipAddPage.selectHospitalitySelectedCount']({
					count: selectedIds.length
				})}
			</span>
			<Button type="button" size="sm" onclick={() => (open = false)}>
				{m['AdminPartnershipAddPage.selectHospitalityDone']()}
			</Button>
		</div>

		{#if isTruncated && rows.length > 0}
			<p
				class="shrink-0 border-t border-border px-4 py-2 text-xs leading-relaxed text-muted-foreground"
			>
				{m['AdminPartnershipAddPage.selectHospitalityTruncated']({ count: rows.length })}
			</p>
		{/if}
	</Dialog.Content>
</Dialog.Root>
