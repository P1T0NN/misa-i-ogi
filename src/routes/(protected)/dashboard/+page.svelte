<script lang="ts">
	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import DashboardStats from '@/shared/components/pages/(protected)/dashboard/dashboard-stats/dashboard-stats.svelte';
	import DashboardHeader from '@/shared/components/pages/(protected)/dashboard/dashboard-header.svelte';
	import DashboardPendingReservations from '@/shared/components/pages/(protected)/dashboard/dashboard-pending-reservations/dashboard-pending-reservations.svelte';
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<DashboardHeader />

	<DashboardStats />

	<DashboardPendingReservations />
</section>
