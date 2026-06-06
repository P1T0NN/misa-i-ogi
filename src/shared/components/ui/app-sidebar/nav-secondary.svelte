<script lang="ts">
	// COMPONENTS
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';

	// TYPES
	import type { ComponentProps } from 'svelte';
	import type { AppSidebarNavSecondaryItemWithActive } from './types.js';

	let {
		items,
		...restProps
	}: {
		items: AppSidebarNavSecondaryItemWithActive[];
	} & ComponentProps<typeof Sidebar.Group> = $props();
</script>

<Sidebar.Group {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu class="gap-2">
			{#each items as item (item.name)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="sm" isActive={item.isActive}>
						{#snippet child({ props })}
							<Link href={item.url} {...props}>
								<item.icon />
								<span>{item.name}</span>
							</Link>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
