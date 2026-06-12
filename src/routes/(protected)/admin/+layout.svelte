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
	import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import StoreIcon from '@lucide/svelte/icons/store';
	import UsersIcon from '@lucide/svelte/icons/users';

	let { children } = $props();

	const navItems: AppSidebarNavItems = {
		navMain: [
			{
				name: m['AdminSidebar.dashboard'](),
				url: ADMIN_PAGE_ENDPOINTS.DASHBOARD,
				icon: LayoutDashboardIcon
			},
			{
				name: m['AdminSidebar.analytics'](),
				url: ADMIN_PAGE_ENDPOINTS.ANALYTICS,
				icon: ChartBarIcon
			},
			{
				name: m['AdminSidebar.users'](),
				url: ADMIN_PAGE_ENDPOINTS.USERS,
				icon: UsersIcon
			},
			{
				name: m['AdminSidebar.accommodations'](),
				url: ADMIN_PAGE_ENDPOINTS.ACCOMMODATIONS,
				icon: BuildingIcon
			},
			{
				name: m['AdminSidebar.hospitalities'](),
				url: ADMIN_PAGE_ENDPOINTS.HOSPITALITIES,
				icon: StoreIcon
			},
			{
				name: m['AdminSidebar.partnerships'](),
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
