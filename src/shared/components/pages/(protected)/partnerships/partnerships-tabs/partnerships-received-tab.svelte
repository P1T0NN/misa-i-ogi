<script lang="ts">
	// COMPONENTS
	import DataList from '@/shared/components/ui/data-list/data-list.svelte';
	import PartnershipRequestItem from './partnership-request-item.svelte';
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
		<PartnershipRequestItem
			requestId={row.requestId}
			accommodationName={row.accommodationName}
			requestedAt={row.requestedAt}
		/>
	{/snippet}

	{#snippet empty()}
		<PartnershipsTabEmpty tab="received" />
	{/snippet}
</DataList>
