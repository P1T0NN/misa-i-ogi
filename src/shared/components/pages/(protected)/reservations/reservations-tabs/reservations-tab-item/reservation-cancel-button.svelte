<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from '@mmailaender/convex-svelte';

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
	title={m['ReservationsPage.ReservationCancelButton.title']()}
	description={m['ReservationsPage.ReservationCancelButton.description']({ guestName })}
>
	<XIcon data-icon="inline-start" />
	{m['ReservationsPage.ReservationCancelButton.label']()}
</ActionButton>
