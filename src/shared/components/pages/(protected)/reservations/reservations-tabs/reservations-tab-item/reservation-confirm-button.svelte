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
	import CheckIcon from '@lucide/svelte/icons/check';

	let {
		reservationId,
		guestName
	}: {
		reservationId: Id<'reservations'>;
		guestName: string;
	} = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	async function confirmReservation() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.reservations.mutations.confirmReservation.confirmReservation,
				{ reservationId }
			);
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

<ActionButton
	function={confirmReservation}
	class="w-full bg-green-600 text-white hover:bg-green-600/90 focus-visible:ring-green-600/20 sm:w-auto"
	{isPending}
	title={m['ReservationsPage.ReservationConfirmButton.title']()}
	description={m['ReservationsPage.ReservationConfirmButton.description']({ guestName })}
>
	<CheckIcon data-icon="inline-start" />
	{m['ReservationsPage.ReservationConfirmButton.label']()}
</ActionButton>
