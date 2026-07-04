<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { TabComponent } from '@/shared/components/ui/tab-component/index.js';
	import { NotificationBadge } from '@/shared/components/ui/notification-badge/index.js';
	import PartnershipsActiveTab from './partnerships-active-tab.svelte';
	import PartnershipsSentTab from './partnerships-sent-tab.svelte';
	import PartnershipsReceivedTab from './partnerships-received-tab.svelte';
	import PartnershipsTabsLoading from '../loading/partnerships-tabs-loading.svelte';

	// TYPES
	import type {
		TabComponentContext,
		TabComponentTabs
	} from '@/shared/components/ui/tab-component/types.js';
	import type { BadgeVariant } from '@/shared/components/ui/badge/index.js';

	type PartnershipsTab = 'active' | 'sent' | 'received';

	// Two subscriptions cover the whole page: live links + the request queue
	// (sent and received come back together from one query).
	const partnershipsQuery = useQuery(
		api.tables.partnerships.queries.fetchMyPartnerships.fetchMyPartnerships,
		{}
	);
	const partnershipRequestsQuery = useQuery(
		api.tables.partnershipRequests.queries.fetchPartnershipRequests.fetchPartnershipRequests,
		{}
	);

	const active = $derived(partnershipsQuery.data ?? []);
	const sent = $derived(partnershipRequestsQuery.data?.sent ?? []);
	const received = $derived(partnershipRequestsQuery.data?.received ?? []);

	const activeLoading = $derived(
		partnershipsQuery.isLoading && partnershipsQuery.data === undefined
	);
	const requestsLoading = $derived(
		partnershipRequestsQuery.isLoading && partnershipRequestsQuery.data === undefined
	);

	const partnershipTabs: TabComponentTabs<PartnershipsTab> = [
		{ value: 'active', label: m['PartnershipsPage.PartnershipsTabs.active']() },
		{ value: 'sent', label: m['PartnershipsPage.PartnershipsTabs.sent']() },
		{ value: 'received', label: m['PartnershipsPage.PartnershipsTabs.received']() }
	];

	function notificationCount(value: PartnershipsTab): number {
		if (value === 'active') return active.length;
		if (value === 'sent') return sent.length;
		return received.length;
	}

	function notificationBadgeVariant(value: PartnershipsTab): BadgeVariant {
		// Received is the only tab that asks the user to act — make it pop.
		if (value === 'received') return 'success';
		return 'secondary';
	}
</script>

{#snippet partnershipTrigger({ tab, value }: TabComponentContext<PartnershipsTab>)}
	{tab.label}
	<NotificationBadge count={notificationCount(value)} variant={notificationBadgeVariant(value)} />
{/snippet}

{#snippet partnershipContent({ value }: TabComponentContext<PartnershipsTab>)}
	{#if value === 'active'}
		{#if activeLoading}
			<PartnershipsTabsLoading />
		{:else}
			<PartnershipsActiveTab rows={active} />
		{/if}
	{:else if requestsLoading}
		<PartnershipsTabsLoading />
	{:else if value === 'sent'}
		<PartnershipsSentTab rows={sent} />
	{:else}
		<PartnershipsReceivedTab rows={received} />
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
