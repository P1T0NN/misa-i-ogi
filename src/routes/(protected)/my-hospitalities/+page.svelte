<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// CONFIG
	import { PAGINATION_DATA } from '@/shared/config.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexDataList from '@/shared/components/ui/data-list/convex-data-list.svelte';
	import MyHospitalitiesEmpty from '@/shared/components/pages/(protected)/my-hospitalities/empty/my-hospitalities-empty.svelte';
	import MyHospitalitiesError from '@/shared/components/pages/(protected)/my-hospitalities/error/my-hospitalities-error.svelte';
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

<SvelteHead />

<section class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
	<MyHospitalitiesHeader
		isLoading={summaryLoading}
		hasError={Boolean(summaryQuery.error)}
		{summary}
	/>

	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h2 class="text-lg font-semibold tracking-normal">Assigned venues</h2>
			<p class="text-muted-foreground text-sm">
				Compact overview of venue type, status, and guest-facing availability.
			</p>
		</div>
	</div>

	{#if summaryLoading}
		<MyHospitalitiesLoading />
	{:else if !hasOwnedHospitalities}
		<MyHospitalitiesEmpty />
	{:else if summaryQuery.error}
		<MyHospitalitiesError />
	{:else}
		<ConvexDataList
			query={api.tables.hospitalities.queries.fetchMyHospitalities.fetchMyHospitalities}
			pageSize={PAGINATION_DATA.DEFAULT_PAGE_SIZE}
			totalCount={summary?.totalCount}
			summaryLoading={summaryLoading}
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
				<MyHospitalitiesError />
			{/snippet}

			{#snippet loading()}
				<MyHospitalitiesLoading />
			{/snippet}
		</ConvexDataList>
	{/if}
</section>
