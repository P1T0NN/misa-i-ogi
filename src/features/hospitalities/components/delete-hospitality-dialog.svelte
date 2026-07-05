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

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	let {
		hospitalityId,
		hospitalityName
	}: {
		hospitalityId: Id<'hospitalities'>;
		hospitalityName: string;
	} = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	async function remove() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.hospitalities.mutations.deleteMyHospitality.deleteMyHospitality,
				{ ids: [hospitalityId] }
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
	{isPending}
	isDestructive
	title={m['DeleteHospitalityDialog.title']()}
	description={m['DeleteHospitalityDialog.description']({ hospitalityName })}
>
	{m['DeleteHospitalityDialog.delete']()}
</ActionButton>
