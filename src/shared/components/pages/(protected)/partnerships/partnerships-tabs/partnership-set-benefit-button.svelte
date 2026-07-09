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

	let { partnershipId }: { partnershipId: Id<'partnerships'> } = $props();

	const convex = useConvexClient();

	let benefit = $state('');
	let isPending = $state(false);

	async function save() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.partnerships.mutations.updatePartnershipBenefit.updatePartnershipBenefit,
				{ partnershipId, benefit }
			);
			if (toastResult(result)) benefit = '';
		} finally {
			isPending = false;
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
			disabled={isPending}
		/>
		<span class="text-xs text-muted-foreground">
			{m['PartnershipsPage.PartnershipRequestItem.benefitHint']()}
		</span>
	</label>
{/snippet}

<ActionButton
	function={save}
	{isPending}
	actionDisabled={benefit.trim().length === 0}
	title={m['PartnershipsPage.PartnershipsActiveTab.setBenefitTitle']()}
	description={m['PartnershipsPage.PartnershipsActiveTab.setBenefitDescription']()}
	body={benefitForm}
>
	{m['PartnershipsPage.PartnershipsActiveTab.setBenefit']()}
</ActionButton>
