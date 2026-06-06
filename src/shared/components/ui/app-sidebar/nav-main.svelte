<script lang="ts">
	// UTILS
	import { appHref } from '@/shared/utils/app-navigation';

	// COMPONENTS
	import * as Collapsible from '@/shared/components/ui/collapsible/index.js';
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';

	// LUCIDE ICONS
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	// TYPES
	import type { AppSidebarNavItemWithActive } from './types.js';

	let {
		items
	}: {
		items: AppSidebarNavItemWithActive[];
	} = $props();

	const navGroups = $derived.by(() => {
		const groups: { label: string; items: AppSidebarNavItemWithActive[] }[] = [];

		for (const item of items) {
			const label = item.groupLabel ?? 'Projects';
			const group = groups.find((entry) => entry.label === label);

			if (group) {
				group.items.push(item);
			} else {
				groups.push({ label, items: [item] });
			}
		}

		return groups;
	});
</script>

{#each navGroups as group (group.label)}
	<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
		<Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>

		<Sidebar.Menu class="gap-2">
			{#each group.items as item (item.name)}
				{#if item.items}
					<Collapsible.Root open={item.isActive} class="group/collapsible">
						<Sidebar.MenuItem>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props} tooltipContent={item.name}>
										<item.icon />
										<span>{item.name}</span>
										<ChevronRightIcon
											class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each item.items as subItem (subItem.name)}
										{@const childHref = appHref(subItem.url)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton size="sm" isActive={subItem.isActive}>
												{#snippet child({ props })}
													<a href={childHref} {...props}>
														<span>{subItem.name}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						</Sidebar.MenuItem>
					</Collapsible.Root>
				{:else}
					{@const href = appHref(item.url!)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={item.isActive}>
							{#snippet child({ props })}
								<a {href} {...props}>
									<item.icon />
									<span>{item.name}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/if}
			{/each}
		</Sidebar.Menu>
	</Sidebar.Group>
{/each}
