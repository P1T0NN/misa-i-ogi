<script lang="ts">
	// LIBRARIES
	import { page } from '$app/state';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import RequestReservationDialog from '@/features/hospitalities/components/request-reservation-dialog.svelte';
	import GuestReservationCard from '@/features/hospitalities/components/guest-reservation-card.svelte';
	import HospitalityHeader from '@/shared/components/pages/(unprotected)/hospitality/hospitality-header.svelte';
	import HospitalityAbout from '@/shared/components/pages/(unprotected)/hospitality/hospitality-about.svelte';
	import HospitalityMenu from '@/shared/components/pages/(unprotected)/hospitality/hospitality-menu.svelte';
	import HospitalityLocation from '@/shared/components/pages/(unprotected)/hospitality/hospitality-location.svelte';
	import HospitalityPartnership from '@/shared/components/pages/(unprotected)/hospitality/hospitality-partnership.svelte';
	import HospitalityDetails from '@/shared/components/pages/(unprotected)/hospitality/hospitality-details.svelte';
	import HospitalityEmpty from '@/shared/components/pages/(unprotected)/hospitality/empty/hospitality-empty.svelte';
	import HospitalityError from '@/shared/components/pages/(unprotected)/hospitality/error/hospitality-error.svelte';
	import HospitalityLoading from '@/shared/components/pages/(unprotected)/hospitality/loading/hospitality-loading.svelte';

	// UTILS
	import { loadingTimeout } from '@/utils/loadingTimeout.svelte.js';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';
	import type { HospitalityDetailsResult } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	const rawHospitalityId = $derived(page.params.id);

	const detailQuery = useQuery(
		api.tables.hospitalities.queries.fetchHospitalityDetails.fetchHospitalityDetails,
		() => (rawHospitalityId ? { hospitalityId: rawHospitalityId as Id<'hospitalities'> } : 'skip')
	);

	const hospitalityResult = $derived(detailQuery.data as HospitalityDetailsResult | undefined);
	const available = $derived(hospitalityResult?.status === 'available' ? hospitalityResult : null);
	const isLoading = $derived(hospitalityResult === undefined && !detailQuery.error);
	const isNotFound = $derived(hospitalityResult?.status === 'not_found');
	const isNotPartnered = $derived(hospitalityResult?.status === 'not_partnered');
	// Backstop: a query stuck waiting on auth looks identical to loading — cap
	// the skeleton so it degrades to the error view (self-heals if data arrives).
	const loadTimeout = loadingTimeout(() => isLoading);
</script>

<SvelteHead
	title={available?.hospitality.name}
	description={m['HospitalityPage.SEO.description']()}
/>

<div class="bg-background text-foreground">
	{#if detailQuery.error || loadTimeout.timedOut}
		<HospitalityError />
	{:else if isLoading}
		<HospitalityLoading />
	{:else if isNotPartnered}
		<HospitalityEmpty reason="notPartnered" />
	{:else if isNotFound}
		<HospitalityEmpty />
	{:else if available}
		{@const { hospitality, partnership, guestReservation } = available}

		<HospitalityHeader {hospitality} />

		<div
			class="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-12 lg:px-8 lg:pb-16 xl:grid-cols-[minmax(0,1fr)_20rem]"
		>
			<div class="flex min-w-0 flex-col gap-12 lg:gap-14">
				<HospitalityAbout {hospitality} />

				<HospitalityMenu {hospitality} />

				<HospitalityLocation {hospitality} />
			</div>

			<aside class="space-y-6 lg:sticky lg:top-28">
				<HospitalityPartnership {partnership} hospitalityName={hospitality.name} />

				{#if guestReservation}
					<GuestReservationCard reservation={guestReservation} hospitalityName={hospitality.name} />
				{:else}
					<RequestReservationDialog
						hospitalityName={hospitality.name}
						hospitalityId={hospitality._id}
					/>
				{/if}

				<HospitalityDetails {hospitality} />
			</aside>
		</div>
	{/if}
</div>
