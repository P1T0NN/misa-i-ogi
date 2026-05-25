<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/components/ui/breadcrumb/breadcrumbClass.svelte.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import EditHospitalityHeader from '@/shared/components/pages/(protected)/edit-hospitality/edit-hospitality-header.svelte';
	import EditHospitalityForm from '@/shared/components/pages/(protected)/edit-hospitality/edit-hospitality-form.svelte';
	import EditHospitalityLoading from '@/shared/components/pages/(protected)/edit-hospitality/loading/edit-hospitality-loading.svelte';
	import EditHospitalityError from '@/shared/components/pages/(protected)/edit-hospitality/error/edit-hospitality-error.svelte';
	import EditHospitalityEmpty from '@/shared/components/pages/(protected)/edit-hospitality/empty/edit-hospitality-empty.svelte';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	const hospitalityId = $derived(page.params.id as Id<'hospitalities'> | undefined);

	const hospitalityQuery = useQuery(
		api.tables.hospitalities.queries.fetchMyHospitalityForEdit.fetchMyHospitalityForEdit,
		() => (hospitalityId ? { hospitalityId } : 'skip')
	);

	const hospitality = $derived(hospitalityQuery.data);

	$effect(() => {
		breadcrumbLabel.set(hospitality?.name);
		return () => breadcrumbLabel.reset();
	});
</script>

<SvelteHead />

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<EditHospitalityHeader />

		{#if hospitalityQuery.error}
			<EditHospitalityError />
		{:else if hospitality === null}
			<EditHospitalityEmpty />
		{:else if hospitality === undefined}
			<EditHospitalityLoading />
		{:else}
			<EditHospitalityForm {hospitality} />
		{/if}
	</div>
</section>
