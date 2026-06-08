<script lang="ts">
	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import DashboardStats from '@/shared/components/pages/(protected)/dashboard/dashboard-stats/dashboard-stats.svelte';
	import DashboardHeader from '@/shared/components/pages/(protected)/dashboard/dashboard-header.svelte';
	import DashboardPendingReservations from '@/shared/components/pages/(protected)/dashboard/dashboard-pending-reservations/dashboard-pending-reservations.svelte';
	import DashboardStatsLoading from '@/shared/components/pages/(protected)/dashboard/loading/dashboard-stats-loading.svelte';
	import DashboardPendingReservationsLoading from '@/shared/components/pages/(protected)/dashboard/loading/dashboard-pending-reservations-loading.svelte';
	import DashboardEmpty from '@/shared/components/pages/(protected)/dashboard/empty/dashboard-empty.svelte';

	const hasOwnedPortfolio = $derived(
		authClass.currentUser?.hasAccommodations === true ||
			authClass.currentUser?.hasHospitalities === true
	);
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<DashboardHeader />

	{#if authClass.userLoading}
		<DashboardStatsLoading />
		<DashboardPendingReservationsLoading />
	{:else if !hasOwnedPortfolio}
		<DashboardEmpty />
	{:else}
		<DashboardStats />
		<DashboardPendingReservations />
	{/if}
</section>
