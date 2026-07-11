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
	import MyAccommodationsEmpty from '@/shared/components/pages/(protected)/my-accommodations/empty/my-accommodations-empty.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
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

<SvelteHead
	title={m['MyAccommodationsPage.SEO.title']()}
	description={m['MyAccommodationsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<MyAccommodationsHeader
		isLoading={summaryLoading}
		hasError={Boolean(summaryQuery.error)}
		{summary}
	/>

	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h2 class="text-lg font-semibold tracking-normal">
				{m['MyAccommodationsPage.assignedStaysTitle']()}
			</h2>
			<p class="text-sm text-muted-foreground">
				{m['MyAccommodationsPage.assignedStaysDescription']()}
			</p>
		</div>
	</div>

	{#if summaryLoading}
		<MyAccommodationsLoading />
	{:else if !hasOwnedAccommodations}
		<MyAccommodationsEmpty />
	{:else if summaryQuery.error}
		<ErrorComponent
			variant="plain"
			title={m['MyAccommodationsPage.errorTitle']()}
			description={m['MyAccommodationsPage.errorDescription']()}
		/>
	{:else}
		<ConvexDataList
			query={api.tables.accommodations.queries.fetchMyAccommodations.fetchMyAccommodations}
			pageSize={PAGINATION_DATA.DEFAULT_PAGE_SIZE}
			totalCount={summary?.totalCount}
			{summaryLoading}
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
				<ErrorComponent
					variant="plain"
					title={m['MyAccommodationsPage.errorTitle']()}
					description={m['MyAccommodationsPage.errorDescription']()}
				/>
			{/snippet}

			{#snippet loading()}
				<MyAccommodationsLoading />
			{/snippet}
		</ConvexDataList>
	{/if}
</section>
