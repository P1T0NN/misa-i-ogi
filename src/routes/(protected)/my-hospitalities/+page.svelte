<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// CONFIG
	import { PAGINATION_DATA } from '@/shared/config.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexDataList from '@/shared/components/ui/data-list/convex-data-list.svelte';
	import MyHospitalitiesEmpty from '@/shared/components/pages/(protected)/my-hospitalities/empty/my-hospitalities-empty.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import MyHospitalitiesHeader from '@/shared/components/pages/(protected)/my-hospitalities/my-hospitalities-header.svelte';
	import MyHospitalitiesItem from '@/shared/components/pages/(protected)/my-hospitalities/my-hospitalities-item.svelte';
	import MyHospitalitiesLoading from '@/shared/components/pages/(protected)/my-hospitalities/loading/my-hospitalities-loading.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	const hasOwnedHospitalities = $derived(authClass.currentUser?.hasHospitalities === true);

	const summaryQuery = useQuery(
		api.tables.hospitalities.queries.fetchMyHospitalitiesSummary.fetchMyHospitalitiesSummary,
		() => (authClass.userLoading || !hasOwnedHospitalities ? 'skip' : {})
	);

	const summary = $derived(summaryQuery.data);
	const summaryLoading = $derived(
		authClass.userLoading ||
			(hasOwnedHospitalities && summaryQuery.data === undefined && !summaryQuery.error)
	);
</script>

<SvelteHead
	title={m['MyHospitalitiesPage.SEO.title']()}
	description={m['MyHospitalitiesPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<MyHospitalitiesHeader
		isLoading={summaryLoading}
		hasError={Boolean(summaryQuery.error)}
		{summary}
	/>

	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h2 class="text-lg font-semibold tracking-normal">
				{m['MyHospitalitiesPage.assignedVenuesTitle']()}
			</h2>
			<p class="text-sm text-muted-foreground">
				{m['MyHospitalitiesPage.assignedVenuesDescription']()}
			</p>
		</div>
	</div>

	{#if summaryLoading}
		<MyHospitalitiesLoading />
	{:else if !hasOwnedHospitalities}
		<MyHospitalitiesEmpty />
	{:else if summaryQuery.error}
		<ErrorComponent
			variant="plain"
			title={m['MyHospitalitiesPage.errorTitle']()}
			description={m['MyHospitalitiesPage.errorDescription']()}
		/>
	{:else}
		<ConvexDataList
			query={api.tables.hospitalities.queries.fetchMyHospitalities.fetchMyHospitalities}
			pageSize={PAGINATION_DATA.DEFAULT_PAGE_SIZE}
			totalCount={summary?.totalCount}
			{summaryLoading}
			hasError={Boolean(summaryQuery.error)}
			getItemKey={(hospitality) => String(hospitality._id)}
		>
			{#snippet item({ item: hospitality })}
				<MyHospitalitiesItem hospitality={hospitality as Doc<'hospitalities'>} />
			{/snippet}

			{#snippet empty()}
				<MyHospitalitiesEmpty />
			{/snippet}

			{#snippet error()}
				<ErrorComponent
					variant="plain"
					title={m['MyHospitalitiesPage.errorTitle']()}
					description={m['MyHospitalitiesPage.errorDescription']()}
				/>
			{/snippet}

			{#snippet loading()}
				<MyHospitalitiesLoading />
			{/snippet}
		</ConvexDataList>
	{/if}
</section>
