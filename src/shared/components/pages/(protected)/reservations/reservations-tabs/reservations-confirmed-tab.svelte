<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';

	// COMPONENTS
	import ConvexDataList from '@/shared/components/ui/data-list/convex-data-list.svelte';
	import { TabsContent } from '@/shared/components/ui/tabs/index.js';
	import ReservationsConfirmedTabEmpty from '../empty/reservations-confirmed-tab-empty.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import ReservationsTabsLoading from '../loading/reservations-tabs-loading.svelte';
	import ReservationsTabItem from './reservations-tab-item/reservations-tab-item.svelte';

	// TYPES
	import type { ReservationDoc } from '@/convex/tables/reservations/types/reservationsTypes.js';

	let {
		searchQuery,
		selectedHospitality
	}: {
		searchQuery: string;
		selectedHospitality: string;
	} = $props();
</script>

<TabsContent value="confirmed" class="pt-4">
	<ConvexDataList
		query={api.tables.reservations.queries.fetchConfirmedReservations.fetchConfirmedReservations}
		queryArgs={{ searchQuery, selectedHospitality }}
		optimizationStrategy="offset"
		listClass="grid gap-3"
		getItemKey={(reservation) => String(reservation._id)}
	>
		{#snippet item({ item: reservation })}
			<ReservationsTabItem reservation={reservation as ReservationDoc} />
		{/snippet}

		{#snippet empty()}
			<ReservationsConfirmedTabEmpty {searchQuery} {selectedHospitality} />
		{/snippet}

		{#snippet error()}
			<ErrorComponent
				variant="card"
				title={m['ReservationsPage.errorTitle']()}
				description={m['ReservationsPage.errorDescription']()}
				showRetry={false}
			/>
		{/snippet}

		{#snippet loading()}
			<ReservationsTabsLoading />
		{/snippet}
	</ConvexDataList>
</TabsContent>
