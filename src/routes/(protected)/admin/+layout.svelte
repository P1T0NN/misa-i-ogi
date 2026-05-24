<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS, PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';
	import AppSidebar from '@/shared/components/ui/app-sidebar/app-sidebar.svelte';
	import SiteHeader from '@/shared/components/ui/app-sidebar/site-header.svelte';

	// TYPES
	import type { AppSidebarNavItems } from '@/shared/components/ui/app-sidebar/types.js';

	// LUCIDE ICONS
	import FrameIcon from '@lucide/svelte/icons/frame';
	import PieChartIcon from '@lucide/svelte/icons/pie-chart';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import HospitalIcon from '@lucide/svelte/icons/hospital';
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';

	let { children } = $props();

	const navItems: AppSidebarNavItems = {
		navMain: [
			{
				name: 'Dashboard',
				url: ADMIN_PAGE_ENDPOINTS.DASHBOARD,
				icon: FrameIcon
			},
			{
				name: 'Users',
				url: ADMIN_PAGE_ENDPOINTS.USERS,
				icon: PieChartIcon
			},
			{
				name: 'Accommodations',
				url: ADMIN_PAGE_ENDPOINTS.ACCOMMODATIONS,
				icon: BuildingIcon
			},
			{
				name: 'Hospitalities',
				url: ADMIN_PAGE_ENDPOINTS.HOSPITALITIES,
				icon: HospitalIcon
			},
			{
				name: 'Partnerships',
				url: ADMIN_PAGE_ENDPOINTS.PARTNERSHIPS,
				icon: Link2Icon
			}
		],
		navSecondary: [
			{
				name: m['AdminSidebar.backToUserDashboard'](),
				url: PROTECTED_PAGE_ENDPOINTS.DASHBOARD,
				icon: LayoutDashboardIcon
			}
		]
	};
</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
	class="admin-shell"
>
	<AppSidebar variant="inset" {navItems} />

	<Sidebar.Inset>
		<SiteHeader hidePaths={['/admin']} />

		<div class="flex min-h-0 flex-1 flex-col">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
