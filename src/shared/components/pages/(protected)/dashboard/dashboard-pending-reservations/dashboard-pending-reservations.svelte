<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '@/shared/components/ui/card/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import DashboardPendingReservationsItem from './dashboard-pending-reservations-item.svelte';
	import DashboardPendingReservationsLoading from '../loading/dashboard-pending-reservations-loading.svelte';
	import DashboardPendingReservationsError from '../error/dashboard-pending-reservations-error.svelte';
	import DashboardPendingReservationsEmpty from '../empty/dashboard-pending-reservations-empty.svelte';

	// LUCIDE ICONS
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	const pendingReservationsQuery = useQuery(
		api.pages.userDashboard.queries.fetchUserDashboardPendingReservations
			.fetchUserDashboardPendingReservations,
		() => ({})
	);

	const reservationRequests = $derived(pendingReservationsQuery.data ?? []);
	const isLoading = $derived(
		pendingReservationsQuery.data === undefined && !pendingReservationsQuery.error
	);
	const hasError = $derived(Boolean(pendingReservationsQuery.error));
	const isEmpty = $derived(!isLoading && !hasError && reservationRequests.length === 0);
</script>

{#if isLoading}
	<DashboardPendingReservationsLoading />
{:else if hasError}
	<DashboardPendingReservationsError />
{:else if isEmpty}
	<DashboardPendingReservationsEmpty />
{:else}
	<div class="min-w-0">
		<Card>
			<CardHeader>
				<div class="flex items-start justify-between gap-3">
					<div>
						<CardTitle class="text-base"
							>{m['DashboardPage.DashboardPendingReservations.cardTitle']()}</CardTitle
						>
						<CardDescription
							>{m['DashboardPage.DashboardPendingReservations.cardDescription']()}</CardDescription
						>
					</div>
					<CalendarCheckIcon class="size-5 text-muted-foreground" />
				</div>
			</CardHeader>

			<CardContent class="flex flex-col gap-3">
				{#each reservationRequests as request (request.id)}
					<DashboardPendingReservationsItem {request} />
				{/each}

				<Button
					href={PROTECTED_PAGE_ENDPOINTS.RESERVATIONS}
					variant="outline"
					size="sm"
					class="w-full"
				>
					{m['DashboardPage.DashboardPendingReservations.viewReservations']()}
					<ArrowRightIcon data-icon="inline-end" />
				</Button>
			</CardContent>
		</Card>
	</div>
{/if}
