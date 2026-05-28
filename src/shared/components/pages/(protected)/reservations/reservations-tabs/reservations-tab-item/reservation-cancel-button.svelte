<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from 'convex-svelte';

	// COMPONENTS
	import ActionButton from '@/shared/components/ui/action-button/action-button.svelte';

	// UTILS
	import { safeMutation } from '@/shared/utils/convexHelpers';
	import { toastResult } from '@/shared/utils/toastResult';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	// LUCIDE ICONS
	import XIcon from '@lucide/svelte/icons/x';

	let {
		reservationId,
		guestName
	}: {
		reservationId: Id<'reservations'>;
		guestName: string;
	} = $props();

	const convex = useConvexClient();

	let isPending = $state(false);

	async function cancelReservation() {
		isPending = true;

		try {
			const result = await safeMutation(
				convex,
				api.tables.reservations.mutations.cancelReservation.cancelReservation,
				{ reservationId }
			);
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

<ActionButton
	function={cancelReservation}
	variant="destructive"
	class="w-full sm:w-auto"
	{isPending}
	isDestructive
	title="Cancel reservation"
	description={`Cancel ${guestName}'s reservation request? This will move it to cancelled reservations.`}
>
	<XIcon data-icon="inline-start" />
	Cancel
</ActionButton>
