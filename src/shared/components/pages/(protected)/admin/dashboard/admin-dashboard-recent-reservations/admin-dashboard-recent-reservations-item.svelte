<script lang="ts">
	// LIBRARIES
	import { getLocale } from '@/shared/lib/paraglide/runtime';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// UTILS
	import { getReservationStatusMeta } from '@/features/reservations/utils/getReservationStatus';
	import { formatReservationGuestCount } from '@/features/reservations/utils/formatReservationGuestCount';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	let { reservation }: { reservation: Doc<'reservations'> } = $props();

	const locale = $derived(getLocale());

	const status = $derived(getReservationStatusMeta(reservation.status));

	function formatDate(value: number) {
		return new Date(value).toLocaleDateString(locale, {
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="rounded-lg border border-border bg-background/70 p-3">
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			<p class="truncate text-sm font-medium">{reservation.guestName}</p>

			<p class="mt-1 truncate text-xs text-muted-foreground">
				{reservation.hospitalityName} · {reservation.requestedTime}h ·
				{formatReservationGuestCount(reservation.guestCount)}
			</p>
		</div>

		<Badge variant={status.badgeVariant} class={status.badgeClass}>{status.label}</Badge>
	</div>

	<p class="mt-2 text-xs text-muted-foreground">{formatDate(reservation._creationTime)}</p>
</div>
