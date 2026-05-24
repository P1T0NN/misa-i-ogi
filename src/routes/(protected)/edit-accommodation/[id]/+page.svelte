<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/classes/breadcrumb-label.svelte.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import EditAccommodationHeader from '@/shared/components/pages/(protected)/edit-accommodation/edit-accommodation-header.svelte';
	import EditAccommodationGuestAccess from '@/shared/components/pages/(protected)/edit-accommodation/edit-accommodation-guest-access.svelte';
	import EditAccommodationForm from '@/shared/components/pages/(protected)/edit-accommodation/edit-accommodation-form.svelte';
	import EditAccommodationLoading from '@/shared/components/pages/(protected)/edit-accommodation/loading/edit-accommodation-loading.svelte';
	import EditAccommodationError from '@/shared/components/pages/(protected)/edit-accommodation/error/edit-accommodation-error.svelte';
	import EditAccommodationEmpty from '@/shared/components/pages/(protected)/edit-accommodation/empty/edit-accommodation-empty.svelte';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	const accommodationId = $derived(page.params.id as Id<'accommodations'> | undefined);

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

<SvelteHead />

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<EditAccommodationHeader />

		{#if accommodationQuery.error}
			<EditAccommodationError />
		{:else if accommodation === null}
			<EditAccommodationEmpty />
		{:else if accommodation === undefined}
			<EditAccommodationLoading />
		{:else}
			<EditAccommodationGuestAccess {accommodation} />
			<EditAccommodationForm {accommodation} />
		{/if}
	</div>
</section>
