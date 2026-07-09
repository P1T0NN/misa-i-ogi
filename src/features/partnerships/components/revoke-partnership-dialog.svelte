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
		partnershipId,
		accommodationName,
		hospitalityName
	}: {
		partnershipId: Id<'partnerships'>;
		accommodationName: string;
		hospitalityName: string;
	} = $props();

	const convex = useConvexClient();

	let isPending = $state(false);

	async function revoke() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.partnerships.mutations.revokePartnership.revokePartnership,
				{ partnershipId }
			);
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

<ActionButton
	function={revoke}
	variant="destructive"
	{isPending}
	isDestructive
	title={m['RevokePartnershipDialog.title']()}
	description={m['RevokePartnershipDialog.description']({
		accommodationName,
		hospitalityName
	})}
>
	{m['RevokePartnershipDialog.revoke']()}
</ActionButton>
