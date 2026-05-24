<script lang="ts">
	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
	import { Separator } from '@/shared/components/ui/separator/index.js';

	// LUCIDE ICONS
	import BedDoubleIcon from '@lucide/svelte/icons/bed-double';
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import StoreIcon from '@lucide/svelte/icons/store';
	import XIcon from '@lucide/svelte/icons/x';

	type DashboardStat = {
		label: string;
		value: string;
		detail: string;
		icon: typeof Building2Icon;
	};

	type AccommodationSummary = {
		id: string;
		name: string;
		location: string;
		status: 'Active' | 'Inactive';
		linkedVenues: number;
		activePerks: number;
		lastScan: string;
	};

	type HospitalitySummary = {
		id: string;
		name: string;
		type: string;
		location: string;
		status: 'Active' | 'Inactive';
		connectedStays: number;
		reservationRequestsEnabled: boolean;
		pendingRequests: number;
	};

	type ReservationRequest = {
		id: string;
		guest: string;
		venue: string;
		when: string;
		partySize: number;
		status: 'Pending' | 'Accepted';
	};

	const stats: DashboardStat[] = [
		{
			label: 'Accommodations',
			value: '2',
			detail: 'Places connected to your account',
			icon: BedDoubleIcon
		},
		{
			label: 'Hospitalities',
			value: '3',
			detail: 'Venues guests can discover',
			icon: StoreIcon
		},
		{
			label: 'Partnerships',
			value: '5',
			detail: 'Live stay to venue links',
			icon: Link2Icon
		},
		{
			label: 'Requests',
			value: '2',
			detail: 'Reservation requests waiting',
			icon: CalendarCheckIcon
		}
	];

	const accommodations: AccommodationSummary[] = [
		{
			id: 'acc-01',
			name: 'Dorchol Loft 14',
			location: 'Dorchol, Belgrade',
			status: 'Active',
			linkedVenues: 3,
			activePerks: 3,
			lastScan: 'Today, 09:20'
		},
		{
			id: 'acc-02',
			name: 'Skadarlija Studio',
			location: 'Skadarlija, Belgrade',
			status: 'Active',
			linkedVenues: 2,
			activePerks: 2,
			lastScan: 'Yesterday, 18:45'
		}
	];

	const hospitalities: HospitalitySummary[] = [
		{
			id: 'hos-01',
			name: 'Mala Basta',
			type: 'Restaurant',
			location: 'Cetinjska, Belgrade',
			status: 'Active',
			connectedStays: 2,
			reservationRequestsEnabled: true,
			pendingRequests: 2
		},
		{
			id: 'hos-02',
			name: 'Kafa Kod Luke',
			type: 'Cafe',
			location: 'Dorchol, Belgrade',
			status: 'Active',
			connectedStays: 1,
			reservationRequestsEnabled: false,
			pendingRequests: 0
		},
		{
			id: 'hos-03',
			name: 'Kalemegdan Walks',
			type: 'Tour',
			location: 'Kalemegdan, Belgrade',
			status: 'Active',
			connectedStays: 2,
			reservationRequestsEnabled: false,
			pendingRequests: 0
		}
	];

	const reservationRequests: ReservationRequest[] = [
		{
			id: 'res-01',
			guest: 'Guest from Dorchol Loft 14',
			venue: 'Mala Basta',
			when: 'Tonight, 20:00',
			partySize: 2,
			status: 'Pending'
		},
		{
			id: 'res-02',
			guest: 'Guest from Skadarlija Studio',
			venue: 'Mala Basta',
			when: 'Tomorrow, 19:30',
			partySize: 4,
			status: 'Pending'
		}
	];
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div class="flex max-w-3xl flex-col gap-2">
			<p class="text-primary font-mono text-xs font-medium uppercase tracking-[0.14em]">
				Partner dashboard
			</p>
			<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Your connected places</h1>
			<p class="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
				View the accommodations and venues connected to your account. Konak handles setup and
				new listings; this space is for daily visibility and reservation decisions.
			</p>
		</div>

		<div class="flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm lg:min-w-56">
			<span class="text-muted-foreground text-xs">Account mode</span>
			<span class="font-medium">View only</span>
		</div>
	</header>

	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
		{#each stats as stat (stat.label)}
			{@const Icon = stat.icon}
			<Card>
				<CardContent class="flex items-start justify-between gap-4 p-4">
					<div class="min-w-0">
						<p class="text-muted-foreground text-xs font-medium">{stat.label}</p>
						<p class="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
						<p class="text-muted-foreground mt-1 text-xs leading-relaxed">{stat.detail}</p>
					</div>
					<span class="rounded-md border border-border bg-muted p-2 text-muted-foreground">
						<Icon class="size-4" />
					</span>
				</CardContent>
			</Card>
		{/each}
	</div>

	<div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.75fr)]">
		<div class="flex min-w-0 flex-col gap-6">
			<section class="flex flex-col gap-3">
				<div class="flex items-center justify-between gap-3">
					<div>
						<h2 class="text-lg font-semibold tracking-tight">Accommodations</h2>
						<p class="text-muted-foreground text-sm">Guest stays connected to this account.</p>
					</div>
					<Badge variant="outline">{accommodations.length} total</Badge>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					{#each accommodations as accommodation (accommodation.id)}
						<Card>
							<CardHeader class="gap-3">
								<div class="flex items-start justify-between gap-3">
									<div class="min-w-0">
										<CardTitle class="truncate text-base">{accommodation.name}</CardTitle>
										<CardDescription class="mt-1 flex items-center gap-1.5">
											<MapPinIcon class="size-3.5" />
											<span class="truncate">{accommodation.location}</span>
										</CardDescription>
									</div>
									{#if accommodation.status === 'Active'}
										<Badge variant="success">{accommodation.status}</Badge>
									{:else}
										<Badge variant="secondary">{accommodation.status}</Badge>
									{/if}
								</div>
							</CardHeader>
							<CardContent class="flex flex-col gap-4">
								<div class="grid grid-cols-2 gap-3 text-sm">
									<div>
										<p class="text-muted-foreground text-xs">Linked venues</p>
										<p class="mt-1 font-medium">{accommodation.linkedVenues}</p>
									</div>
									<div>
										<p class="text-muted-foreground text-xs">Active perks</p>
										<p class="mt-1 font-medium">{accommodation.activePerks}</p>
									</div>
								</div>
								<Separator />
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<ClockIcon class="size-4" />
									<span>Last scan: {accommodation.lastScan}</span>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</section>

			<section class="flex flex-col gap-3">
				<div class="flex items-center justify-between gap-3">
					<div>
						<h2 class="text-lg font-semibold tracking-tight">Hospitalities</h2>
						<p class="text-muted-foreground text-sm">
							Venues guests can visit after scanning their stay QR.
						</p>
					</div>
					<Badge variant="outline">{hospitalities.length} total</Badge>
				</div>

				<div class="grid gap-3">
					{#each hospitalities as hospitality (hospitality.id)}
						<Card>
							<CardContent class="flex flex-col gap-4 p-4">
								<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div class="min-w-0">
										<div class="flex flex-wrap items-center gap-2">
											<h3 class="truncate text-base font-semibold">{hospitality.name}</h3>
											{#if hospitality.status === 'Active'}
												<Badge variant="success">{hospitality.status}</Badge>
											{:else}
												<Badge variant="secondary">{hospitality.status}</Badge>
											{/if}
										</div>
										<p class="text-muted-foreground mt-1 text-sm">
											{hospitality.type} in {hospitality.location}
										</p>
									</div>

									{#if hospitality.reservationRequestsEnabled}
										<Badge variant="default">Reservations on</Badge>
									{:else}
										<Badge variant="outline">Reservations off</Badge>
									{/if}
								</div>

								<div class="grid gap-3 text-sm sm:grid-cols-3">
									<div>
										<p class="text-muted-foreground text-xs">Connected stays</p>
										<p class="mt-1 font-medium">{hospitality.connectedStays}</p>
									</div>
									<div>
										<p class="text-muted-foreground text-xs">Pending requests</p>
										<p class="mt-1 font-medium">{hospitality.pendingRequests}</p>
									</div>
									<div>
										<p class="text-muted-foreground text-xs">Guest booking flow</p>
										<p class="mt-1 font-medium">
											{#if hospitality.reservationRequestsEnabled}
												Konak request
											{:else}
												Direct contact
											{/if}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</section>
		</div>

		<aside class="flex min-w-0 flex-col gap-6">
			<Card>
				<CardHeader>
					<div class="flex items-start justify-between gap-3">
						<div>
							<CardTitle class="text-base">Reservation requests</CardTitle>
							<CardDescription>Accept or decline guest requests from opted-in venues.</CardDescription>
						</div>
						<CalendarCheckIcon class="size-5 text-primary" />
					</div>
				</CardHeader>
				<CardContent class="flex flex-col gap-3">
					{#each reservationRequests as request (request.id)}
						<div class="rounded-lg border border-border bg-background p-3">
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="truncate text-sm font-medium">{request.venue}</p>
									<p class="text-muted-foreground mt-1 text-xs">{request.guest}</p>
								</div>
								<Badge variant="outline">{request.status}</Badge>
							</div>
							<div class="mt-3 grid grid-cols-2 gap-2 text-xs">
								<div>
									<p class="text-muted-foreground">When</p>
									<p class="mt-1 font-medium">{request.when}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Guests</p>
									<p class="mt-1 font-medium">{request.partySize}</p>
								</div>
							</div>
							<div class="mt-3 grid grid-cols-2 gap-2">
								<Button variant="outline" size="sm" class="w-full">
									<XIcon data-icon="inline-start" />
									Decline
								</Button>
								<Button size="sm" class="w-full">
									<CheckIcon data-icon="inline-start" />
									Accept
								</Button>
							</div>
						</div>
					{/each}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div class="flex items-start justify-between gap-3">
						<div>
							<CardTitle class="text-base">Reservation settings</CardTitle>
							<CardDescription>Per-venue opt in. You stay in control.</CardDescription>
						</div>
						<SettingsIcon class="size-5 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent class="flex flex-col gap-4 text-sm">
					<p class="text-muted-foreground leading-relaxed">
						When enabled, guests request a reservation from the Konak page and you handle the
						decision here. When disabled, the page shows normal contact options.
					</p>

					<div class="flex flex-col gap-3">
						{#each hospitalities as hospitality (hospitality.id)}
							<div class="flex items-center justify-between gap-3">
								<div class="min-w-0">
									<p class="truncate font-medium">{hospitality.name}</p>
									<p class="text-muted-foreground text-xs">
										{#if hospitality.reservationRequestsEnabled}
											Requests enabled
										{:else}
											Direct contact
										{/if}
									</p>
								</div>
								{#if hospitality.reservationRequestsEnabled}
									<Badge variant="success">On</Badge>
								{:else}
									<Badge variant="secondary">Off</Badge>
								{/if}
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</aside>
	</div>
</section>
