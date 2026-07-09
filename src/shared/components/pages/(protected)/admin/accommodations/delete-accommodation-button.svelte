<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import ActionButton from '@/shared/components/ui/action-button/action-button.svelte';

	// UTILS
	import { safeMutation } from '@/shared/utils/convexHelpers';
	import { toastResult } from '@/shared/utils/toastResult';

	// LUCIDE ICONS
	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	/**
	 * Admin per-row delete — same guarded mutation as the bulk checkbox-select
	 * flow (`deleteAccommodations`), just scoped to one row. Blocked server-side
	 * by the same rules as owner self-delete: active guest session or active
	 * partnership must be cleared first.
	 */
	let {
		accommodationId,
		accommodationName
	}: {
		accommodationId: Id<'accommodations'>;
		accommodationName: string;
	} = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	async function remove() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.accommodations.mutations.deleteAccommodations.deleteAccommodations,
				{ ids: [accommodationId] }
			);
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

<ActionButton
	function={remove}
	variant="destructive"
	size="sm"
	{isPending}
	isDestructive
	title={m['AdminAccommodationsPage.DeleteAccommodationButton.title']()}
	description={m['AdminAccommodationsPage.DeleteAccommodationButton.description']({
		accommodationName
	})}
>
	<Trash2Icon data-icon="inline-start" />
	{m['AdminAccommodationsPage.DeleteAccommodationButton.delete']()}
</ActionButton>
