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
	class="relative grid min-w-0 gap-5 sm:gap-6 lg:block lg:min-h-188"
	aria-label="Example reservation management dashboard"
>
	<div
		class="pointer-events-none absolute inset-x-6 top-10 h-48 rounded-full bg-primary/10 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative z-20 w-full min-w-0 lg:absolute lg:-top-8 lg:left-0 lg:w-[92%]">
		<Card
			class="shadow-dashboard-card overflow-hidden rounded-2xl border border-border-2 bg-card py-0"
		>
			<CardHeader class="border-b border-border-2 px-4 py-4">
				<CardTitle class="text-base">Reservation requests</CardTitle>
				<CardDescription>Example dashboard data for one hospitality.</CardDescription>
			</CardHeader>

			<CardContent class="px-3 pt-3 pb-4 sm:px-4">
				<ul class="grid gap-2.5">
					{#each landingOwnerFeaturesReservationRequests as request (request.id)}
						{@const statusMeta = getReservationStatusMeta(request.status)}

						<li
							class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-xl border border-border-2 bg-background px-3 py-2.5 sm:flex sm:items-center"
						>
							<img
								src={request.image}
								alt={request.venueName}
								class="row-span-2 size-10 shrink-0 rounded-lg border border-border-2 object-cover sm:row-span-1"
								loading="lazy"
								decoding="async"
							/>

							<div class="min-w-0 flex-1">
								<p class="mb-0 truncate text-sm font-medium text-foreground">{request.guestName}</p>
								<p class="mb-0 truncate text-xs text-muted-foreground">
									{request.venueName} · {reservationGuestCount(request.guestCount)} · {request.requestedTime}
								</p>
							</div>

							<div class="col-start-2 min-w-0 sm:col-auto sm:shrink-0">
								<Badge variant={statusMeta.badgeVariant} class={statusMeta.badgeClass}>
									{statusMeta.label}
								</Badge>
							</div>
						</li>
					{/each}
				</ul>
			</CardContent>
		</Card>
	</div>

	<div
		class="relative z-10 w-full min-w-0 lg:absolute lg:right-0 lg:bottom-0 lg:w-[72%] lg:translate-y-10"
	>
		<Card
			class="shadow-dashboard-card overflow-hidden rounded-2xl border border-border-2 bg-card py-0"
		>
			<CardHeader class="border-b border-border-2 px-4 py-4">
				<CardTitle class="text-base">This week</CardTitle>
				<CardDescription>Every request stays tracked.</CardDescription>
			</CardHeader>

			<CardContent class="grid grid-cols-2 gap-3 px-3 pt-4 pb-4 sm:px-4">
				{#each landingOwnerFeaturesReservationStatusSummary as item (item.status)}
					{@const meta = getReservationStatusMeta(item.status)}
					<div class="rounded-xl border border-border-2 bg-background px-3 py-3">
						<span class="font-display text-2xl font-medium text-foreground tabular-nums">
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
