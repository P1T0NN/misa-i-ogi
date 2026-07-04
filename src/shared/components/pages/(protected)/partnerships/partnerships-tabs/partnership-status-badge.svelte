<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { cn } from '@/shared/utils/utils.js';

	// COMPONENTS
	import { Badge, type BadgeVariant } from '@/shared/components/ui/badge/index.js';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	type PartnershipRequestStatus = Doc<'partnershipRequests'>['status'];

	interface Props {
		status: PartnershipRequestStatus;
		class?: string;
	}

	let { status, class: className }: Props = $props();

	function variantFor(value: PartnershipRequestStatus): BadgeVariant {
		if (value === 'accepted') return 'success';
		if (value === 'declined') return 'destructive';
		return 'default';
	}
</script>

<Badge variant={variantFor(status)} class={cn('shrink-0', className)}>
	{#if status === 'accepted'}
		{m['PartnershipsPage.PartnershipStatusBadge.accepted']()}
	{:else if status === 'declined'}
		{m['PartnershipsPage.PartnershipStatusBadge.declined']()}
	{:else}
		{m['PartnershipsPage.PartnershipStatusBadge.pending']()}
	{/if}
</Badge>
