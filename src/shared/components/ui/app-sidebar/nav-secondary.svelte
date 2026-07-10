<script lang="ts">
	// COMPONENTS
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

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
							<Link
								href={item.url}
								{...props}
								class={cn(
									props.class as string,
									item.highlight &&
										'border border-sidebar-border bg-sidebar-accent/50 font-medium text-primary hover:bg-sidebar-accent hover:text-primary [&_svg]:text-primary'
								)}
							>
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
