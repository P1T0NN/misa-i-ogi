<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import * as Card from '@/shared/components/ui/card/index.js';

	// UTILS
	import { formatReservationGuestCount } from '@/features/reservations/utils/formatReservationGuestCount';

	// TYPES
	import type { HospitalityGuestReservation } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// LUCIDE ICONS
	import CheckCircle2Icon from '@lucide/svelte/icons/circle-check';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import UsersIcon from '@lucide/svelte/icons/users';

	let {
		reservation,
		hospitalityName = ''
	}: {
		reservation: HospitalityGuestReservation;
		hospitalityName?: string;
	} = $props();

	const isConfirmed = $derived(reservation.status === 'confirmed');
	const detailsId = $derived(
		isConfirmed ? 'reservation-confirmed-details' : 'reservation-pending-details'
	);
</script>

<Card.Root class="border-border/80 bg-muted/30">
	<Card.Content class="space-y-4 p-4">
		<Button
			type="button"
			variant={isConfirmed ? 'default' : 'secondary'}
			class="h-11 w-full justify-center disabled:opacity-100 {isConfirmed
				? 'bg-success text-success-foreground hover:bg-success/90'
				: ''}"
			disabled
			aria-describedby={detailsId}
		>
			{#if isConfirmed}
				<CheckCircle2Icon data-icon="inline-start" class="size-4" aria-hidden="true" />
				{m['HospitalityPage.GuestReservationCard.statusConfirmed']()}
			{:else}
				<ClockIcon data-icon="inline-start" class="size-4" aria-hidden="true" />
				{m['HospitalityPage.GuestReservationCard.statusPending']()}
			{/if}
		</Button>

		<div id={detailsId} class="space-y-4 rounded-lg border border-border/80 bg-background/70 p-4">
			<div class="space-y-1">
				{#if isConfirmed}
					<p class="font-serif text-lg leading-tight font-medium tracking-tight">
						{m['HospitalityPage.GuestReservationCard.confirmedTitle']()}
					</p>
					{#if hospitalityName}
						<p class="text-sm leading-relaxed text-muted-foreground">
							{m['HospitalityPage.GuestReservationCard.confirmedDescriptionWithName']({
								hospitalityName
							})}
						</p>
					{:else}
						<p class="text-sm leading-relaxed text-muted-foreground">
							{m['HospitalityPage.GuestReservationCard.confirmedDescription']()}
						</p>
					{/if}
				{:else}
					<p class="font-serif text-lg leading-tight font-medium tracking-tight">
						{m['HospitalityPage.GuestReservationCard.pendingTitle']()}
					</p>
					{#if hospitalityName}
						<p class="text-sm leading-relaxed text-muted-foreground">
							{m['HospitalityPage.GuestReservationCard.pendingDescriptionWithName']({
								hospitalityName
							})}
						</p>
					{:else}
						<p class="text-sm leading-relaxed text-muted-foreground">
							{m['HospitalityPage.GuestReservationCard.pendingDescription']()}
						</p>
					{/if}
				{/if}
			</div>

			<dl class="space-y-3 text-sm">
				<div class="flex gap-3">
					<ClockIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<div class="min-w-0">
						<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
							{m['HospitalityPage.GuestReservationCard.dlPreferredTime']()}
						</dt>
						<dd class="mt-0.5 font-medium text-foreground">{reservation.requestedTime}</dd>
					</div>
				</div>

				<div class="flex gap-3">
					<UserRoundIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<div class="min-w-0">
						<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
							{m['HospitalityPage.GuestReservationCard.dlGuestName']()}
						</dt>
						<dd class="mt-0.5 truncate font-medium text-foreground">{reservation.guestName}</dd>
					</div>
				</div>

				<div class="flex gap-3">
					<UsersIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<div class="min-w-0">
						<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
							{m['HospitalityPage.GuestReservationCard.dlGuestCount']()}
						</dt>
						<dd class="mt-0.5 font-medium text-foreground">
							{formatReservationGuestCount(reservation.guestCount)}
						</dd>
					</div>
				</div>

				<div class="flex gap-3">
					<PhoneIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<div class="min-w-0">
						<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
							{m['HospitalityPage.GuestReservationCard.dlPhone']()}
						</dt>
						<dd class="mt-0.5 font-medium wrap-break-word text-foreground">{reservation.phone}</dd>
					</div>
				</div>

				{#if reservation.email}
					<div class="flex gap-3">
						<MailIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
						<div class="min-w-0">
							<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
								{m['HospitalityPage.GuestReservationCard.dlEmail']()}
							</dt>
							<dd class="mt-0.5 font-medium wrap-break-word text-foreground">
								{reservation.email}
							</dd>
						</div>
					</div>
				{/if}
			</dl>
		</div>
	</Card.Content>
</Card.Root>
