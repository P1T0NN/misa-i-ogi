<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import { SearchInputConvex } from '@/shared/components/ui/search-input/index.js';

	// UTILS
	import { capitalize } from '@/shared/utils/stringUtils';

	// TYPES
	import type { SearchInputItem } from '@/shared/components/ui/search-input/types.js';
	import type { Doc } from '@/convex/auth/component/_generated/dataModel';

	// LUCIDE ICONS
	import XIcon from '@lucide/svelte/icons/x';

	let {
		value = $bindable(''),
		inputId,
		disabled = false,
		onValueChange
	}: {
		value?: string;
		inputId: string;
		disabled?: boolean;
		onValueChange?: (value: string) => void;
	} = $props();

	let search = $state('');
	let selectedOwner = $state<SearchInputItem | null>(null);

	function mapUserToItem(user: Doc<'user'>): SearchInputItem {
		const title = capitalize(user.name || user.email);

		return {
			id: user._id,
			title,
			description: user.email
		};
	}

	function selectOwner(item: SearchInputItem) {
		selectedOwner = item;
		value = item.id;
		onValueChange?.(item.id);
		search = item.title;
	}

	function clearOwner() {
		selectedOwner = null;
		value = '';
		onValueChange?.('');
		search = '';
	}
</script>

<div class="flex flex-col gap-3">
	<SearchInputConvex
		id={inputId}
		bind:value={search}
		query={api.tables.users.userQueries.listUsers}
		queryArgs={{ searchField: 'name' }}
		mapItem={mapUserToItem}
		placeholder="Search users by name"
		aria-label="Search owner"
		emptyTitle="No users found"
		emptyDescription="Try a different owner name."
		{disabled}
		onSelect={selectOwner}
	/>

	{#if selectedOwner && value}
		<div
			class="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
		>
			<div class="min-w-0 space-y-1">
				<p class="text-sm font-medium">{selectedOwner.title}</p>
				<p class="truncate font-mono text-xs text-muted-foreground">{value}</p>
			</div>

			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label="Clear owner"
				{disabled}
				onclick={clearOwner}
			>
				<XIcon aria-hidden="true" />
			</Button>
		</div>
	{/if}
</div>
