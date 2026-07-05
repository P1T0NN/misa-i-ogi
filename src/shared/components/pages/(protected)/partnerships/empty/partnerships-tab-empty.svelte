<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';
	import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';

	// COMPONENTS
	import { Card, CardContent } from '@/shared/components/ui/card/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import SendIcon from '@lucide/svelte/icons/send';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import PlusIcon from '@lucide/svelte/icons/plus';

	interface Props {
		tab: 'active' | 'sent' | 'received';
	}

	let { tab }: Props = $props();
</script>

<Card class="border-dashed">
	<CardContent class="flex flex-col items-center gap-2 py-12 text-center">
		{#if tab === 'active'}
			<Link2Icon class="size-8 text-muted-foreground" aria-hidden="true" />
		{:else if tab === 'sent'}
			<SendIcon class="size-8 text-muted-foreground" aria-hidden="true" />
		{:else}
			<InboxIcon class="size-8 text-muted-foreground" aria-hidden="true" />
		{/if}

		<p class="max-w-sm text-sm text-muted-foreground">
			{#if tab === 'active'}
				{m['PartnershipsPage.PartnershipsTabEmpty.active']()}
			{:else if tab === 'sent'}
				{m['PartnershipsPage.PartnershipsTabEmpty.sent']()}
			{:else}
				{m['PartnershipsPage.PartnershipsTabEmpty.received']()}
			{/if}
		</p>

		{#if tab === 'active' && CUSTOM_PARTNERSHIP_ENABLED}
			<Button
				href={PROTECTED_PAGE_ENDPOINTS.CREATE_CUSTOM_PARTNERSHIP}
				variant="outline"
				size="sm"
				class="mt-2"
			>
				<PlusIcon data-icon="inline-start" />
				{m['PartnershipsPage.PartnershipsTabEmpty.activeCta']()}
			</Button>
		{/if}
	</CardContent>
</Card>
