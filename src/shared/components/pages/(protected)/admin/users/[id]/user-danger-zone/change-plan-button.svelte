<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import ActionButton from '@/shared/components/ui/action-button/action-button.svelte';

	// UTILS
	import { safeMutation } from '@/shared/utils/convexHelpers';
	import { toastResult } from '@/shared/utils/toastResult';

	/**
	 * Admin-only toggle for the two-tier custom-partnership plan
	 * (`free` ↔ `pro`) — the only write path for `plan` until real billing
	 * lands. Parallel to `change-role-button`.
	 */
	let {
		userId,
		userEmail,
		plan
	}: {
		userId: string;
		userEmail: string;
		plan: string;
	} = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	const downgrading = $derived(plan === 'pro');

	async function confirmPlanChange() {
		const nextPlan = downgrading ? 'free' : 'pro';
		isPending = true;
		try {
			const result = await safeMutation(convex, api.tables.users.userMutations.setUserPlan, {
				userId,
				plan: nextPlan
			});
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

{#if downgrading}
	<ActionButton
		function={confirmPlanChange}
		variant="outline"
		{isPending}
		title={m['AdminUserPage.ChangePlanButton.downgradeTitle']({ email: userEmail })}
		description={m['AdminUserPage.ChangePlanButton.downgradeDescription']()}
	>
		{m['AdminUserPage.ChangePlanButton.downgrade']()}
	</ActionButton>
{:else}
	<ActionButton
		function={confirmPlanChange}
		variant="outline"
		{isPending}
		title={m['AdminUserPage.ChangePlanButton.upgradeTitle']({ email: userEmail })}
		description={m['AdminUserPage.ChangePlanButton.upgradeDescription']()}
	>
		{m['AdminUserPage.ChangePlanButton.upgrade']()}
	</ActionButton>
{/if}
