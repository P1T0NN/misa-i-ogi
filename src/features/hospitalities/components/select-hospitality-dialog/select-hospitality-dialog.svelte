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
	 * Multi-select hospitality search-and-pick. Owner-scoped by default (the caller's
	 * own hospitalities); pass `forAdmin` to search every hospitality instead.
	 */
	let {
		inputId,
		value = [],
		setValue,
		forAdmin = false
	}: {
		inputId: string;
		value?: string[];
		setValue: (next: unknown) => void;
		/** Admin flow: search all hospitalities instead of the caller's own. */
		forAdmin?: boolean;
	} = $props();

	// Pick the matching search query for the scope. The explicit type collapses the
	// ternary union so `SearchDialog` can infer the row type.
	const searchQuery: SearchDialogQuery<Doc<'hospitalities'>> = $derived(
		forAdmin
			? api.tables.hospitalities.queries.searchAllHospitalities.searchAllHospitalities
			: api.tables.hospitalities.queries.searchMyHospitalities.searchMyHospitalities
	);
</script>

<SearchDialog
	{inputId}
	fetchQuery={searchQuery}
	mapItem={(h) => ({ id: h._id, name: h.name, city: h.city })}
	{value}
	{setValue}
	multiple
	showId={forAdmin}
	selectLabel={m['SelectHospitalityDialog.selectHospitality']()}
	changeLabel={m['SelectHospitalityDialog.modifyHospitality']()}
	dialogTitle={m['SelectHospitalityDialog.dialogTitle']()}
	placeholder={m['SelectHospitalityDialog.searchPlaceholder']()}
/>
