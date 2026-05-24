<script lang="ts">
	// UTILS
	import { appHref } from '@/shared/utils/app-navigation';

	// COMPONENTS
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';

	// TYPES
	import type { ComponentProps } from 'svelte';
	import type { AppSidebarNavItemWithActive } from './types.js';

	let {
		items,
		...restProps
	}: {
		items: AppSidebarNavItemWithActive[];
	} & ComponentProps<typeof Sidebar.Group> = $props();
</script>

<Sidebar.Group {...restProps}>
	<Sidebar.GroupContent>
	<Sidebar.Menu class="gap-2">
		{#each items as item (item.name)}
			{@const href = appHref(item.url)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="sm" isActive={item.isActive}>
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
	</Sidebar.GroupContent>
</Sidebar.Group>
