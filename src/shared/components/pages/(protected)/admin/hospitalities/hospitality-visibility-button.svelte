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
	import type { Doc } from '@/convex/_generated/dataModel';

	/**
	 * Admin publish/unpublish toggle for a hospitality's connect-flow
	 * visibility — the only lever anywhere (owners deliberately have none).
	 * Mirrors `change-role-button`: confirm dialog, then mutate.
	 */
	let { hospitality }: { hospitality: Doc<'hospitalities'> } = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	// Missing = public: every legacy row is admin-created (backfilled anyway).
	const isPublic = $derived((hospitality.visibility ?? 'public') === 'public');

	async function confirmToggle() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.hospitalities.mutations.setHospitalityVisibility.setHospitalityVisibility,
				{ hospitalityId: hospitality._id, visibility: isPublic ? 'private' : 'public' }
			);
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

<ActionButton
	function={confirmToggle}
	variant="outline"
	size="sm"
	{isPending}
	title={isPublic
		? m['AdminHospitalitiesPage.HospitalityVisibilityButton.makePrivateTitle']({ name: hospitality.name })
		: m['AdminHospitalitiesPage.HospitalityVisibilityButton.makePublicTitle']({ name: hospitality.name })}
	description={isPublic
		? m['AdminHospitalitiesPage.HospitalityVisibilityButton.makePrivateDescription']()
		: m['AdminHospitalitiesPage.HospitalityVisibilityButton.makePublicDescription']()}
>
	{isPublic
		? m['AdminHospitalitiesPage.HospitalityVisibilityButton.public']()
		: m['AdminHospitalitiesPage.HospitalityVisibilityButton.private']()}
</ActionButton>
