<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import DataList from '@/shared/components/ui/data-list/data-list.svelte';
	import PartnershipStatusBadge from './partnership-status-badge.svelte';
	import PartnershipsTabEmpty from '../empty/partnerships-tab-empty.svelte';

	// TYPES
	import type { typesPartnershipRequestItem } from '@/features/partnerships/types/partnershipsTypes';

	interface Props {
		rows: typesPartnershipRequestItem[];
	}

	let { rows }: Props = $props();
</script>

<DataList items={rows} isEmpty={rows.length === 0} getItemKey={(row) => String(row.requestId)}>
	{#snippet item({ item: row })}
		<div
			class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/70 p-4"
		>
			<div class="flex min-w-0 flex-col gap-0.5">
				<span class="truncate font-medium">
					{row.hospitalityName ?? m['PartnershipsPage.PartnershipsSentTab.unknownVenue']()}
				</span>

				<span class="text-xs text-muted-foreground">
					{m['PartnershipsPage.PartnershipsSentTab.sentOn']({
						date: new Date(row.requestedAt).toLocaleDateString()
					})}
				</span>
			</div>

			<PartnershipStatusBadge status={row.status} />
		</div>
	{/snippet}

	{#snippet empty()}
		<PartnershipsTabEmpty tab="sent" />
	{/snippet}
</DataList>
