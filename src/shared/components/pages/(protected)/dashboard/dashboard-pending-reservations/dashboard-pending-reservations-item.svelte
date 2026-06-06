<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// UTILS
	import { getReservationStatusMeta } from '@/features/reservations/utils/getReservationStatus.js';

	// TYPES
	import type { UserDashboardPendingReservation } from '@/convex/pages/userDashboard/types/userDashboardTypes.js';

	// LUCIDE ICONS
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import StoreIcon from '@lucide/svelte/icons/store';

	let { request }: { request: UserDashboardPendingReservation } = $props();

	const statusMeta = $derived(getReservationStatusMeta(request.status));
</script>

<div class="rounded-lg border border-border bg-background p-3">
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			<p class="truncate text-sm font-medium">{request.guestName}</p>
			<p class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
				<StoreIcon class="size-3 shrink-0" />
				<span class="truncate">{request.hospitalityName}</span>
			</p>
		</div>
		<Badge variant={statusMeta.badgeVariant} class={statusMeta.badgeClass}>
			{statusMeta.label}
		</Badge>
	</div>

	<div class="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
		<span class="flex min-w-0 items-center gap-1">
			<ClockIcon class="size-3 shrink-0" />
			<span>{request.requestedTime}h</span>
		</span>

		<div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
			<span class="flex min-w-0 items-center gap-1">
				<PhoneIcon class="size-3 shrink-0" />
				<span class="truncate">{request.phone}</span>
			</span>

			{#if request.email}
				<span class="flex min-w-0 items-center gap-1">
					<MailIcon class="size-3 shrink-0" />
					<span class="truncate">{request.email}</span>
				</span>
			{/if}
		</div>
	</div>
</div>
