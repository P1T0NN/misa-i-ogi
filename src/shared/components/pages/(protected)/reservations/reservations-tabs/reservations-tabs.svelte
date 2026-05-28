<script lang="ts">
	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import { NotificationBadge } from '@/shared/components/ui/notification-badge/index.js';
	import { Input } from '@/shared/components/ui/input/index.js';
	import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '@/shared/components/ui/select/index.js';
	import ReservationsTabsError from '../error/reservations-tabs-error.svelte';
	import ReservationsTabsLoading from '../loading/reservations-tabs-loading.svelte';
	import ReservationsPendingTab from './reservations-pending-tab.svelte';
	import ReservationsConfirmedTab from './reservations-confirmed-tab.svelte';
	import ReservationsPastTab from './reservations-past-tab.svelte';
	import ReservationsCancelledTab from './reservations-cancelled-tab.svelte';

	// UTILS
	import { getReservationStatusMeta } from '@/features/reservations/utils/getReservationStatus.js';

	// TYPES
	import type {
		ReservationCounts,
		ReservationStatus
	} from '@/convex/tables/reservations/types/reservationsTypes.js';

	// LUCIDE ICONS
	import FilterXIcon from '@lucide/svelte/icons/filter-x';
	import SearchIcon from '@lucide/svelte/icons/search';
	import StoreIcon from '@lucide/svelte/icons/store';

	let {
		hospitalityNames,
		counts,
		isLoading = false,
		hasError = false
	}: {
		hospitalityNames: string[];
		counts: ReservationCounts;
		isLoading?: boolean;
		hasError?: boolean;
	} = $props();

	let activeTab = $state<ReservationStatus>('pending');
	let visitedTabs = $state<ReservationStatus[]>(['pending']);
	let searchQuery = $state('');
	let hospitalityFilter = $state<string[]>(['all']);

	const selectedHospitality = $derived(hospitalityFilter[0] ?? 'all');

	const pendingStatusMeta = getReservationStatusMeta('pending');
	const confirmedStatusMeta = getReservationStatusMeta('confirmed');
	const cancelledStatusMeta = getReservationStatusMeta('cancelled');
	const noShowStatusMeta = getReservationStatusMeta('no_show');

	function markTabVisited(tab: string | undefined) {
		if (!tab) return;
		const reservationTab = tab as ReservationStatus;
		if (visitedTabs.includes(reservationTab)) return;
		visitedTabs = [...visitedTabs, reservationTab];
	}

	function clearFilters() {
		searchQuery = '';
		hospitalityFilter = ['all'];
	}
</script>

<Tabs bind:value={activeTab} onValueChange={markTabVisited}>
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<TabsList>
			<TabsTrigger value="pending">
				Pending
				<NotificationBadge
					count={counts.pending}
					variant={pendingStatusMeta.badgeVariant}
					class={pendingStatusMeta.badgeClass}
				/>
			</TabsTrigger>
			
			<TabsTrigger value="confirmed">
				Confirmed
				<NotificationBadge
					count={counts.confirmed}
					variant={confirmedStatusMeta.badgeVariant}
					class={confirmedStatusMeta.badgeClass}
				/>
			</TabsTrigger>
			
			<TabsTrigger value="cancelled">
				Cancelled
				<NotificationBadge
					count={counts.cancelled}
					variant={cancelledStatusMeta.badgeVariant}
					class={cancelledStatusMeta.badgeClass}
				/>
			</TabsTrigger>
			
			<TabsTrigger value="no_show">
				No-show
				<NotificationBadge
					count={counts.no_show}
					variant={noShowStatusMeta.badgeVariant}
					class={noShowStatusMeta.badgeClass}
				/>
			</TabsTrigger>
		</TabsList>

		<div class="flex items-center gap-2">
			<div class="relative">
				<SearchIcon
					class="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
				/>

				<Input
					class="h-8 w-44 pl-8 text-xs"
					placeholder="Search guest, venue, phone…"
					bind:value={searchQuery}
				/>
			</div>

			<Select type="multiple" bind:value={hospitalityFilter}>
				<SelectTrigger class="h-8 w-40 text-xs">
					<StoreIcon class="mr-1.5 size-3.5 text-muted-foreground" />
					{#if selectedHospitality === 'all'}
						<span class="text-xs text-muted-foreground">All venues</span>
					{:else}
						<span class="truncate text-xs">{selectedHospitality}</span>
					{/if}
				</SelectTrigger>

				<SelectContent>
					<SelectItem value="all">All venues</SelectItem>
					{#each hospitalityNames as hospitalityName (hospitalityName)}
						<SelectItem value={hospitalityName}>{hospitalityName}</SelectItem>
					{/each}
				</SelectContent>
			</Select>

			{#if searchQuery.trim() || selectedHospitality !== 'all'}
				<Button variant="ghost" size="icon-sm" onclick={clearFilters} aria-label="Clear filters">
					<FilterXIcon class="size-3.5" />
				</Button>
			{/if}
		</div>
	</div>

	{#if isLoading}
		<ReservationsTabsLoading />
	{:else if hasError}
		<ReservationsTabsError />
	{:else}
		{#if visitedTabs.includes('pending')}
			<ReservationsPendingTab {searchQuery} {selectedHospitality} />
		{/if}
		{#if visitedTabs.includes('confirmed')}
			<ReservationsConfirmedTab {searchQuery} {selectedHospitality} />
		{/if}
		{#if visitedTabs.includes('cancelled')}
			<ReservationsCancelledTab {searchQuery} {selectedHospitality} />
		{/if}
		{#if visitedTabs.includes('no_show')}
			<ReservationsPastTab {searchQuery} {selectedHospitality} />
		{/if}
	{/if}
</Tabs>
