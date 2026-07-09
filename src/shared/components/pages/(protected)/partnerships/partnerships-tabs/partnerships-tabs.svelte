<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';

	// COMPONENTS
	import { TabComponent } from '@/shared/components/ui/tab-component/index.js';
	import PartnershipsActiveTab from './partnerships-active-tab.svelte';
	import PartnershipsSentTab from './partnerships-sent-tab.svelte';
	import PartnershipsReceivedTab from './partnerships-received-tab.svelte';
	import PartnershipsPlatformTable from './partnerships-platform-table.svelte';

	// TYPES
	import type {
		TabComponentContext,
		TabComponentTabs
	} from '@/shared/components/ui/tab-component/types.js';

	type PartnershipsTab = 'active' | 'sent' | 'received';

	const partnershipTabs: TabComponentTabs<PartnershipsTab> = [
		{ value: 'active', label: m['PartnershipsPage.PartnershipsTabs.active']() },
		{ value: 'sent', label: m['PartnershipsPage.PartnershipsTabs.sent']() },
		{ value: 'received', label: m['PartnershipsPage.PartnershipsTabs.received']() }
	];
</script>

{#if CUSTOM_PARTNERSHIP_ENABLED}
	{#snippet partnershipTrigger({ tab }: TabComponentContext<PartnershipsTab>)}
		{tab.label}
	{/snippet}

	{#snippet partnershipContent({ value }: TabComponentContext<PartnershipsTab>)}
		{#if value === 'active'}
			<PartnershipsActiveTab />
		{:else if value === 'sent'}
			<PartnershipsSentTab />
		{:else}
			<PartnershipsReceivedTab />
		{/if}
	{/snippet}

	<TabComponent
		tabs={partnershipTabs}
		queryKey="partnerships-tab"
		defaultValue="active"
		trigger={partnershipTrigger}
		content={partnershipContent}
		contentClass="mt-2"
	/>
{:else}
	<PartnershipsPlatformTable />
{/if}
