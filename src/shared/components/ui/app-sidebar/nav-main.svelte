<script lang="ts">
	// UTILS
	import { appHref } from '@/shared/utils/app-navigation';

	// COMPONENTS
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';

	// TYPES
	import type { AppSidebarNavItemWithActive } from './types.js';

	let {
		items
	}: {
		items: AppSidebarNavItemWithActive[];
	} = $props();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>

	<Sidebar.Menu class="gap-2">
		{#each items as item (item.name)}
			{@const href = appHref(item.url)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton isActive={item.isActive}>
					{#snippet child({ props })}
						<a href={href} {...props}>
							<item.icon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
