<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SearchDialog from '@/shared/components/ui/search-dialog/search-dialog.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';
	import type { SearchDialogQuery } from '@/shared/components/ui/search-dialog/search-dialog.svelte';

	/**
	 * Accommodation search-and-pick. Owner-scoped by default (the caller's own
	 * accommodations); pass `forAdmin` to search every accommodation instead.
	 */
	let {
		inputId,
		value = '',
		setValue,
		forAdmin = false
	}: {
		inputId: string;
		value?: string;
		setValue: (next: unknown) => void;
		/** Admin flow: search all accommodations instead of the caller's own. */
		forAdmin?: boolean;
	} = $props();

	// Pick the matching search query for the scope. The explicit type collapses the
	// ternary union so `SearchDialog` can infer the row type.
	const searchQuery: SearchDialogQuery<Doc<'accommodations'>> = $derived(
		forAdmin
			? api.tables.accommodations.queries.searchAllAccommodations.searchAllAccommodations
			: api.tables.accommodations.queries.searchMyAccommodations.searchMyAccommodations
	);
</script>

<SearchDialog
	{inputId}
	fetchQuery={searchQuery}
	mapItem={(a) => ({ id: a._id, name: a.name, city: a.city })}
	{value}
	{setValue}
	showId={forAdmin}
	selectLabel={m['SelectAccommodationDialog.selectAccommodation']()}
	changeLabel={m['SelectAccommodationDialog.modifyAccommodation']()}
	dialogTitle={m['SelectAccommodationDialog.dialogTitle']()}
	placeholder={m['SelectAccommodationDialog.searchPlaceholder']()}
/>
