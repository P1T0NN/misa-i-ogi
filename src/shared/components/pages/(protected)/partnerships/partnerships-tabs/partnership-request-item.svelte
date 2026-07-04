<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PARTNERSHIP_BENEFIT_MAX_LENGTH } from '@/shared/config.js';

	// COMPONENTS
	import ActionButton from '@/shared/components/ui/action-button/action-button.svelte';
	import { Input } from '@/shared/components/ui/input/index.js';

	// UTILS
	import { safeMutation } from '@/shared/utils/convexHelpers';
	import { toastResult } from '@/shared/utils/toastResult';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	/**
	 * One pending row in the "Received" tab. Accept opens a confirm dialog with
	 * the guest-facing benefit input (the venue's offer is the accepting
	 * owner's call, never the requester's); Decline is a plain confirm.
	 */
	let {
		requestId,
		accommodationName,
		requestedAt
	}: {
		requestId: Id<'partnershipRequests'>;
		accommodationName: string | null;
		requestedAt: number;
	} = $props();

	const convex = useConvexClient();

	let benefit = $state('');
	let isAccepting = $state(false);
	let isDeclining = $state(false);

	async function accept() {
		isAccepting = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.partnerships.mutations.acceptPartnershipRequest.acceptPartnershipRequest,
				{ requestId, benefit }
			);
			if (toastResult(result)) benefit = '';
		} finally {
			isAccepting = false;
		}
	}

	async function decline() {
		isDeclining = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.partnerships.mutations.declinePartnershipRequest.declinePartnershipRequest,
				{ requestId }
			);
			toastResult(result);
		} finally {
			isDeclining = false;
		}
	}
</script>

{#snippet benefitForm()}
	<label class="flex flex-col gap-1 text-sm">
		<span>{m['PartnershipsPage.PartnershipRequestItem.benefitLabel']()}</span>
		<Input
			bind:value={benefit}
			maxlength={PARTNERSHIP_BENEFIT_MAX_LENGTH}
			placeholder={m['PartnershipsPage.PartnershipRequestItem.benefitPlaceholder']()}
			disabled={isAccepting}
		/>
		<span class="text-xs text-muted-foreground">
			{m['PartnershipsPage.PartnershipRequestItem.benefitHint']()}
		</span>
	</label>
{/snippet}

<div
	class="flex flex-col gap-3 rounded-lg border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
>
	<div class="flex min-w-0 flex-col gap-0.5">
		<span class="truncate font-medium">
			{accommodationName ?? m['PartnershipsPage.PartnershipRequestItem.unknownProperty']()}
		</span>
		<span class="text-xs text-muted-foreground">
			{m['PartnershipsPage.PartnershipRequestItem.requestedOn']({
				date: new Date(requestedAt).toLocaleDateString()
			})}
		</span>
	</div>

	<div class="flex shrink-0 items-center gap-2">
		<ActionButton
			function={accept}
			isPending={isAccepting}
			actionDisabled={benefit.trim().length === 0}
			title={m['PartnershipsPage.PartnershipRequestItem.acceptTitle']()}
			description={m['PartnershipsPage.PartnershipRequestItem.acceptDescription']()}
			body={benefitForm}
		>
			{m['PartnershipsPage.PartnershipRequestItem.accept']()}
		</ActionButton>

		<ActionButton
			function={decline}
			variant="destructive"
			isPending={isDeclining}
			isDestructive
			title={m['PartnershipsPage.PartnershipRequestItem.declineTitle']()}
			description={m['PartnershipsPage.PartnershipRequestItem.declineDescription']()}
		>
			{m['PartnershipsPage.PartnershipRequestItem.decline']()}
		</ActionButton>
	</div>
</div>
