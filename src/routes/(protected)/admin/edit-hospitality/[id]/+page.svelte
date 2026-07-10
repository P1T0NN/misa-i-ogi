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
	import EditHospitalityHeader from '@/shared/components/pages/(protected)/edit-hospitality/edit-hospitality-header.svelte';
	import AdminEditHospitalityCreateType from '@/shared/components/pages/(protected)/admin/edit-hospitality/admin-edit-hospitality-create-type.svelte';
	import AdminEditHospitalityForm from '@/shared/components/pages/(protected)/admin/edit-hospitality/admin-edit-hospitality-form.svelte';
	import EditHospitalityLoading from '@/shared/components/pages/(protected)/edit-hospitality/loading/edit-hospitality-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import EditHospitalityEmpty from '@/shared/components/pages/(protected)/edit-hospitality/empty/edit-hospitality-empty.svelte';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	const hospitalityId = $derived(page.params.id as Id<'hospitalities'> | undefined);

	const hospitalityQuery = useQuery(
		api.tables.hospitalities.queries.fetchHospitalityForAdminEdit.fetchHospitalityForAdminEdit,
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
		<EditHospitalityHeader
			backHref={ADMIN_PAGE_ENDPOINTS.HOSPITALITIES}
			backLabel={m['AdminEditHospitalityPage.back']()}
		/>

		{#if hospitalityQuery.error}
			<ErrorComponent
				variant="minimal"
				title={m['EditHospitalityPage.errorTitle']()}
				description={m['EditHospitalityPage.errorDescription']()}
				showRetry={false}
			/>
		{:else if hospitality === null}
			<EditHospitalityEmpty />
		{:else if hospitality === undefined}
			<EditHospitalityLoading />
		{:else}
			<AdminEditHospitalityCreateType
				hospitalityId={hospitality._id}
				name={hospitality.name}
				createType={hospitality.createType}
			/>
			<AdminEditHospitalityForm {hospitality} />
		{/if}
	</div>
</section>
