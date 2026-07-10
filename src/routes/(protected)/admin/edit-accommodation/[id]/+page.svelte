<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/components/ui/breadcrumb/breadcrumbClass.svelte.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import EditAccommodationHeader from '@/shared/components/pages/(protected)/edit-accommodation/edit-accommodation-header.svelte';
	import EditAccommodationGuestAccess from '@/shared/components/pages/(protected)/edit-accommodation/edit-accommodation-guest-access.svelte';
	import EditAccommodationForm from '@/shared/components/pages/(protected)/edit-accommodation/edit-accommodation-form.svelte';
	import EditAccommodationLoading from '@/shared/components/pages/(protected)/edit-accommodation/loading/edit-accommodation-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import EditAccommodationEmpty from '@/shared/components/pages/(protected)/edit-accommodation/empty/edit-accommodation-empty.svelte';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	const accommodationId = $derived(page.params.id as Id<'accommodations'> | undefined);

	// The fetch query and update mutation already allow an admin caller (not owner-only).
	const accommodationQuery = useQuery(
		api.tables.accommodations.queries.fetchMyAccommodationForEdit.fetchMyAccommodationForEdit,
		() => (accommodationId ? { accommodationId } : 'skip')
	);

	const accommodation = $derived(accommodationQuery.data);

	$effect(() => {
		breadcrumbLabel.set(accommodation?.name);
		return () => breadcrumbLabel.reset();
	});
</script>

<SvelteHead
	title={accommodation?.name ?? m['EditAccommodationPage.SEO.title']()}
	description={m['EditAccommodationPage.SEO.description']()}
/>

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<EditAccommodationHeader
			backHref={ADMIN_PAGE_ENDPOINTS.ACCOMMODATIONS}
			backLabel={m['AdminEditAccommodationPage.back']()}
		/>

		{#if accommodationQuery.error}
			<ErrorComponent
				variant="minimal"
				title={m['EditAccommodationPage.errorTitle']()}
				description={m['EditAccommodationPage.errorDescription']()}
				showRetry={false}
			/>
		{:else if accommodation === null}
			<EditAccommodationEmpty />
		{:else if accommodation === undefined}
			<EditAccommodationLoading />
		{:else}
			<EditAccommodationGuestAccess {accommodation} />
			<EditAccommodationForm {accommodation} successHref={ADMIN_PAGE_ENDPOINTS.ACCOMMODATIONS} />
		{/if}
	</div>
</section>
