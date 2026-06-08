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
	import MyAccommodationsEmpty from '@/shared/components/pages/(protected)/my-accommodations/empty/my-accommodations-empty.svelte';
	import MyAccommodationsError from '@/shared/components/pages/(protected)/my-accommodations/error/my-accommodations-error.svelte';
	import MyAccommodationsHeader from '@/shared/components/pages/(protected)/my-accommodations/my-accommodations-header.svelte';
	import MyAccommodationsItem from '@/shared/components/pages/(protected)/my-accommodations/my-accommodations-item.svelte';
	import MyAccommodationsLoading from '@/shared/components/pages/(protected)/my-accommodations/loading/my-accommodations-loading.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	const hasOwnedAccommodations = $derived(authClass.currentUser?.hasAccommodations === true);

	const summaryQuery = useQuery(
		api.tables.accommodations.queries.fetchMyAccommodationsSummary.fetchMyAccommodationsSummary,
		() => (authClass.userLoading || !hasOwnedAccommodations ? 'skip' : {})
	);

	const summary = $derived(summaryQuery.data);
	const summaryLoading = $derived(
		authClass.userLoading ||
			(hasOwnedAccommodations && summaryQuery.data === undefined && !summaryQuery.error)
	);
</script>

<SvelteHead />

<section class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
	<MyAccommodationsHeader
		isLoading={summaryLoading}
		hasError={Boolean(summaryQuery.error)}
		{summary}
	/>

	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h2 class="text-lg font-semibold tracking-normal">Assigned stays</h2>
			<p class="text-muted-foreground text-sm">
				Compact overview of stay type, status, and location for each assigned accommodation.
			</p>
		</div>
	</div>

	{#if summaryLoading}
		<MyAccommodationsLoading />
	{:else if !hasOwnedAccommodations}
		<MyAccommodationsEmpty />
	{:else if summaryQuery.error}
		<MyAccommodationsError />
	{:else}
		<ConvexDataList
			query={api.tables.accommodations.queries.fetchMyAccommodations.fetchMyAccommodations}
			pageSize={PAGINATION_DATA.DEFAULT_PAGE_SIZE}
			totalCount={summary?.totalCount}
			summaryLoading={summaryLoading}
			hasError={Boolean(summaryQuery.error)}
			getItemKey={(accommodation) => String(accommodation._id)}
		>
			{#snippet item({ item: accommodation })}
				<MyAccommodationsItem accommodation={accommodation as Doc<'accommodations'>} />
			{/snippet}

			{#snippet empty()}
				<MyAccommodationsEmpty />
			{/snippet}

			{#snippet error()}
				<MyAccommodationsError />
			{/snippet}

			{#snippet loading()}
				<MyAccommodationsLoading />
			{/snippet}
		</ConvexDataList>
	{/if}
</section>
