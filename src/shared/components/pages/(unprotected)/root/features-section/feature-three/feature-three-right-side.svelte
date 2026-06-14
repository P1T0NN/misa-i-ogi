<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';

	// UTILS
	import { reservationGuestCount } from '@/features/reservations/i18n/reservationDisplay';
	import { getReservationStatusMeta } from '@/features/reservations/utils/getReservationStatus';

	// DATA
	import {
		landingOwnerFeaturesReservationRequests,
		landingOwnerFeaturesReservationStatusSummary
	} from '@/shared/data/dummyData';
</script>

<div
	class="relative grid gap-5 sm:gap-6 lg:block lg:min-h-188"
	aria-label="Example reservation management dashboard"
>
	<div
		class="pointer-events-none absolute inset-x-6 top-10 h-48 rounded-full bg-primary/10 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative z-20 w-full lg:absolute lg:-top-8 lg:left-0 lg:w-[92%]">
		<Card
			class="overflow-hidden rounded-2xl border border-border-2 bg-card py-0 shadow-dashboard-card"
		>
			<CardHeader class="border-b border-border-2 px-4 py-4">
				<CardTitle class="text-base">Reservation requests</CardTitle>
				<CardDescription>Example dashboard data for one venue.</CardDescription>
			</CardHeader>

			<CardContent class="px-3 pt-3 pb-4 sm:px-4">
				<ul class="grid gap-2.5">
					{#each landingOwnerFeaturesReservationRequests as request (request.id)}
						{@const statusMeta = getReservationStatusMeta(request.status)}
						<li
							class="flex items-center gap-3 rounded-xl border border-border-2 bg-background px-3 py-2.5"
						>
							<img
								src={request.image}
								alt={request.venueName}
								class="size-10 shrink-0 rounded-lg border border-border-2 object-cover"
								loading="lazy"
								decoding="async"
							/>

							<div class="min-w-0 flex-1">
								<p class="mb-0 truncate text-sm font-medium text-foreground">{request.guestName}</p>
								<p class="mb-0 truncate text-xs text-muted-foreground">
									{request.venueName} · {reservationGuestCount(request.guestCount)} · {request.requestedTime}
								</p>
							</div>

							<Badge variant={statusMeta.badgeVariant} class={statusMeta.badgeClass}>
								{statusMeta.label}
							</Badge>
						</li>
					{/each}
				</ul>
			</CardContent>
		</Card>
	</div>

	<div class="relative z-10 w-full lg:absolute lg:right-0 lg:bottom-0 lg:w-[72%] lg:translate-y-10">
		<Card
			class="overflow-hidden rounded-2xl border border-border-2 bg-card py-0 shadow-dashboard-card"
		>
			<CardHeader class="border-b border-border-2 px-4 py-4">
				<CardTitle class="text-base">This week</CardTitle>
				<CardDescription>Every request stays tracked.</CardDescription>
			</CardHeader>

			<CardContent class="grid grid-cols-2 gap-3 px-3 pt-4 pb-4 sm:px-4">
				{#each landingOwnerFeaturesReservationStatusSummary as item (item.status)}
					{@const meta = getReservationStatusMeta(item.status)}
					<div class="rounded-xl border border-border-2 bg-background px-3 py-3">
						<span class="font-display text-2xl font-medium tabular-nums text-foreground">
							{item.count}
						</span>

						<div class="mt-2">
							<Badge variant={meta.badgeVariant} class={meta.badgeClass}>{meta.label}</Badge>
						</div>
					</div>
				{/each}
			</CardContent>
		</Card>
	</div>
</div>
