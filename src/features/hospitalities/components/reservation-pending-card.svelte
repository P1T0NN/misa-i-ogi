<script lang="ts">
	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import * as Card from '@/shared/components/ui/card/index.js';

	// TYPES
	import type { HospitalityGuestPendingReservation } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// ICONS
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';

	let {
		reservation,
		hospitalityName = ''
	}: {
		reservation: HospitalityGuestPendingReservation;
		hospitalityName?: string;
	} = $props();
</script>

<Card.Root class="border-border/80 bg-muted/30">
	<Card.Content class="space-y-4 p-4">
		<Button
			type="button"
			variant="secondary"
			class="h-11 w-full justify-center disabled:opacity-100"
			disabled
			aria-describedby="reservation-pending-details"
		>
			<ClockIcon data-icon="inline-start" class="size-4" aria-hidden="true" />
			Reservation Pending
		</Button>

		<div
			id="reservation-pending-details"
			class="space-y-4 rounded-lg border border-border/80 bg-background/70 p-4"
		>
			<div class="space-y-1">
				<p class="font-serif text-lg leading-tight font-medium tracking-tight">Request sent</p>
				{#if hospitalityName}
					<p class="text-sm leading-relaxed text-muted-foreground">
						{hospitalityName} has your details and can contact you to confirm.
					</p>
				{:else}
					<p class="text-sm leading-relaxed text-muted-foreground">
						The hospitality has your details and can contact you to confirm.
					</p>
				{/if}
			</div>

			<dl class="space-y-3 text-sm">
				<div class="flex gap-3">
					<ClockIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<div class="min-w-0">
						<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
							Preferred time
						</dt>
						<dd class="mt-0.5 font-medium text-foreground">{reservation.requestedTime}</dd>
					</div>
				</div>

				<div class="flex gap-3">
					<UserRoundIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<div class="min-w-0">
						<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
							Guest name
						</dt>
						<dd class="mt-0.5 truncate font-medium text-foreground">{reservation.guestName}</dd>
					</div>
				</div>

				<div class="flex gap-3">
					<PhoneIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
					<div class="min-w-0">
						<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
							Phone
						</dt>
						<dd class="mt-0.5 font-medium wrap-break-word text-foreground">{reservation.phone}</dd>
					</div>
				</div>

				{#if reservation.email}
					<div class="flex gap-3">
						<MailIcon class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
						<div class="min-w-0">
							<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
								Email
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
