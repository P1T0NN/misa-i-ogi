<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AdminDashboardMetrics from '@/shared/components/pages/(protected)/admin/dashboard/admin-dashboard-metrics.svelte';
	import AdminDashboardHeader from '@/shared/components/pages/(protected)/admin/dashboard/admin-dashboard-header.svelte';
	import AdminDashboardLoading from '@/shared/components/pages/(protected)/admin/dashboard/loading/admin-dashboard-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';

	const dashboardQuery = useQuery(
		api.pages.adminDashboard.queries.fetchAdminDashboardPage.fetchAdminDashboardPage,
		() => ({})
	);

	const isLoading = $derived(dashboardQuery.data === undefined && !dashboardQuery.error);
	const hasError = $derived(Boolean(dashboardQuery.error));
	const data = $derived(dashboardQuery.data);
</script>

<SvelteHead
	title={m['AdminDashboardPage.SEO.title']()}
	description={m['AdminDashboardPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 p-4 md:p-6 lg:gap-8 lg:p-8">
	<AdminDashboardHeader />

	{#if isLoading}
		<AdminDashboardLoading />
	{:else if hasError}
		<ErrorComponent
			variant="header"
			title={m['AdminDashboardPage.errorTitle']()}
			description={m['AdminDashboardPage.errorDescription']()}
			showRetry={false}
		/>
	{:else if data}
		<AdminDashboardMetrics totals={data.totals} />
	{/if}
</section>
