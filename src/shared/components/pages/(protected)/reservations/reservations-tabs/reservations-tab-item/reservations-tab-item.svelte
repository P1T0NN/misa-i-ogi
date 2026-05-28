<script lang="ts">
	// COMPONENTS
	import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar/index.js';
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';
	import { Separator } from '@/shared/components/ui/separator/index.js';
	import ContactViaWhatsappButton from './contact-via-whatsapp-button.svelte';
	import ReservationCancelButton from './reservation-cancel-button.svelte';
	import ReservationConfirmButton from './reservation-confirm-button.svelte';

	// UTILS
	import { getReservationStatusMeta } from '@/features/reservations/utils/getReservationStatus.js';
	import { initialsFromName } from '@/shared/utils/stringUtils.js';

	// TYPES
	import type { ReservationDoc } from '@/convex/tables/reservations/types/reservationsTypes.js';

	// LUCIDE ICONS
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import StoreIcon from '@lucide/svelte/icons/store';

	let { reservation }: { reservation: ReservationDoc } = $props();

	const statusMeta = $derived(getReservationStatusMeta(reservation.status));
	const guestDisplayName = $derived(reservation.guestName?.trim() || reservation.email || 'Guest');
	const hospitalityDisplayName = $derived(
		reservation.hospitalityName?.trim() || String(reservation.hospitalityId)
	);
	const email = $derived(reservation.email.trim());
</script>

<Card>
	<CardContent class="p-4">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div class="flex min-w-0 items-start gap-3">
				<Avatar class="size-10 shrink-0 sm:size-9">
					<AvatarFallback class="text-xs">
						{initialsFromName(guestDisplayName)}
					</AvatarFallback>
				</Avatar>

				<div class="min-w-0 flex-1">
					<div class="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
						<h3 class="min-w-0 truncate text-sm leading-tight font-semibold">
							{guestDisplayName}
						</h3>
						<Badge variant={statusMeta.badgeVariant} class={['w-fit', statusMeta.badgeClass]}>
							{statusMeta.label}
						</Badge>
					</div>

					<div
						class="mt-2 grid gap-1.5 text-xs text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1"
					>
						<span class="flex min-w-0 items-center gap-1">
							<StoreIcon class="size-3 shrink-0" />
							<span class="truncate">{hospitalityDisplayName}</span>
						</span>
						<span class="flex items-center gap-1">
							<ClockIcon class="size-3 shrink-0" />
							<span>{reservation.requestedTime}h</span>
						</span>
					</div>
				</div>
			</div>

			{#if reservation.status === 'pending'}
				<div class="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:self-center">
					<ReservationCancelButton reservationId={reservation._id} guestName={guestDisplayName} />
					<ReservationConfirmButton reservationId={reservation._id} guestName={guestDisplayName} />
				</div>
			{:else if reservation.status === 'confirmed'}
				<div class="flex w-full items-center sm:w-auto sm:self-center">
					<ContactViaWhatsappButton
						phone={reservation.phone}
						guestName={guestDisplayName}
						hospitalityName={hospitalityDisplayName}
					/>
				</div>
			{/if}
		</div>

		<Separator class="mt-4" />

		<div
			class="mt-3 grid gap-2 text-xs text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-3"
		>
			<span class="flex min-w-0 items-center gap-1">
				<PhoneIcon class="size-3 shrink-0" />
				<span class="truncate">{reservation.phone}</span>
			</span>
			{#if email}
				<span class="flex min-w-0 items-center gap-1">
					<MailIcon class="size-3 shrink-0" />
					<span class="truncate">{email}</span>
				</span>
			{/if}
			<span class="flex min-w-0 items-center gap-1 sm:ml-auto">
				<span class="shrink-0">Reservation ID</span>
				<span class="truncate font-mono">{reservation._id}</span>
			</span>
		</div>
	</CardContent>
</Card>
