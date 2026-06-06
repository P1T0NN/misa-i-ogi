<script lang="ts">
	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AnalyticsHeader from '@/features/analytics/components/analytics-header.svelte';
	import UserAnalyticsOverviewQrScans from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-qr-scans.svelte';
	import UserAnalyticsOverviewGuestActivations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-guest-activations.svelte';
	import UserAnalyticsOverviewReservations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-reservations.svelte';
	import UserAnalyticsOverviewTopAccommodations from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-top-accommodations.svelte';
	import UserAnalyticsOverviewTopHospitalities from '@/shared/components/pages/(protected)/user-analytics/user-analytics-overview/user-analytics-overview-top-hospitalities.svelte';
</script>

<SvelteHead />

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<AnalyticsHeader
		eyebrow="Analytics overview"
		title="Owner analytics"
		description="A practical snapshot of guest activity, reservation demand, and places that need attention."
	/>

	<UserAnalyticsOverviewQrScans />

	<UserAnalyticsOverviewGuestActivations />

	<UserAnalyticsOverviewReservations />

	<UserAnalyticsOverviewTopAccommodations />

	<UserAnalyticsOverviewTopHospitalities />
</section>
