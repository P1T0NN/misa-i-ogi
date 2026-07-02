<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/components/ui/breadcrumb/breadcrumbClass.svelte.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import EditHospitalityHeader from '@/shared/components/pages/(protected)/edit-hospitality/edit-hospitality-header.svelte';
	import EditHospitalityForm from '@/shared/components/pages/(protected)/edit-hospitality/edit-hospitality-form.svelte';
	import EditHospitalityLoading from '@/shared/components/pages/(protected)/edit-hospitality/loading/edit-hospitality-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
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

<SvelteHead
	title={hospitality?.name ?? m['EditHospitalityPage.SEO.title']()}
	description={m['EditHospitalityPage.SEO.description']()}
/>

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<EditHospitalityHeader />

		{#if hospitalityQuery.error}
			<ErrorComponent
				variant="minimal"
				title={m['EditHospitalityPage.EditHospitalityError.title']()}
				description={m['EditHospitalityPage.EditHospitalityError.description']()}
				showRetry={false}
			/>
		{:else if hospitality === null}
			<EditHospitalityEmpty />
		{:else if hospitality === undefined}
			<EditHospitalityLoading />
		{:else}
			<EditHospitalityForm {hospitality} />
		{/if}
	</div>
</section>
