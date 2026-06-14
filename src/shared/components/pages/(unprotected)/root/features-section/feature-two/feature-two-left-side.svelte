<script lang="ts">
	// COMPONENTS
	import AnalyticsTopAccommodationsTable from '@/features/analytics/components/analytics-top-accommodations-table.svelte';
	import AnalyticsTopHospitalitiesTable from '@/features/analytics/components/analytics-top-hospitalities-table.svelte';

	// DATA
	import {
		landingOwnerFeaturesAccommodationAnalyticsTopHospitalitiesTableRows,
		landingOwnerFeaturesHospitalityAnalyticsTopAccommodationsTableRows
	} from '@/shared/data/dummyData';

	const tableCardClass =
		'*:data-[slot=card]:overflow-hidden *:data-[slot=card]:rounded-2xl *:data-[slot=card]:border-border-2 *:data-[slot=card]:bg-card *:data-[slot=card]:py-0 *:data-[slot=card]:shadow-dashboard-card *:data-[slot=card]:*:data-[slot=card-content]:px-3 *:data-[slot=card]:*:data-[slot=card-content]:pb-4 *:data-[slot=card]:*:data-[slot=card-content]:sm:px-4 *:data-[slot=card]:*:data-[slot=card-header]:border-b *:data-[slot=card]:*:data-[slot=card-header]:border-border-2 *:data-[slot=card]:*:data-[slot=card-header]:px-4 *:data-[slot=card]:*:data-[slot=card-header]:py-4';
</script>

<div
	class="relative grid gap-5 sm:gap-6 lg:block lg:min-h-188"
	aria-label="Example partner performance dashboard tables"
>
	<div
		class="pointer-events-none absolute inset-x-6 top-12 h-52 rounded-full bg-primary/10 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative z-20 w-full lg:absolute lg:-top-8 lg:left-0 lg:w-[92%] {tableCardClass}">
		<AnalyticsTopAccommodationsTable
			rows={landingOwnerFeaturesHospitalityAnalyticsTopAccommodationsTableRows}
			variant="dummy"
			title="Accommodation performance"
			description="Example source stays sending guests to this hospitality."
		/>
	</div>

	<div
		class="relative z-10 w-full lg:absolute lg:right-0 lg:bottom-0 lg:w-[92%] lg:translate-y-10 {tableCardClass}"
	>
		<AnalyticsTopHospitalitiesTable
			rows={landingOwnerFeaturesAccommodationAnalyticsTopHospitalitiesTableRows}
			variant="dummy"
			title="Hospitality performance"
			description="Example partner venues receiving attention from this accommodation."
		/>
	</div>
</div>
