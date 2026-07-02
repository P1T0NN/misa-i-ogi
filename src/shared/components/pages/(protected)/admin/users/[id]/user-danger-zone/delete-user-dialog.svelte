<script lang="ts">
	// SVELTEKIT IMPORTS
	import { appGoto } from '@/shared/utils/app-navigation';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import ActionButton from '@/shared/components/ui/action-button/action-button.svelte';
	import { Input } from '@/shared/components/ui/input/index.js';

	// UTILS
	import { safeMutation } from '@/shared/utils/convexHelpers';
	import { toastResult } from '@/shared/utils/toastResult';

	/**
	 * Self-contained "Delete…" affordance. Renders its own destructive trigger,
	 * gates the confirm action behind a typed-email match (via `ActionButton`'s
	 * `actionDisabled` prop), and calls the `deleteUser` Convex mutation on
	 * confirm. Navigates to `redirectUrl` after success.
	 *
	 * Admin targets use the same destructive trigger and dialog chrome as other
	 * delete flows; the proceed action stays hidden and disabled until the user
	 * is demoted (`hideProceed`, `actionDisabled`). The server enforces the same
	 * rule (`ADMIN_CANNOT_BE_DELETED`) as defense in depth.
	 */
	let {
		userId,
		userEmail,
		redirectUrl,
		role
	}: {
		userId: string;
		userEmail: string;
		redirectUrl?: string;
		role: string;
	} = $props();

	const convex = useConvexClient();

	let typedConfirm = $state('');
	let isPending = $state(false);

	async function confirm() {
		if (role === 'admin' || typedConfirm !== userEmail) return;
		isPending = true;
		try {
			const result = await safeMutation(convex, api.tables.users.userMutations.deleteUser, {
				userId
			});
			if (!toastResult(result)) return;

			typedConfirm = '';
			if (redirectUrl) await appGoto(redirectUrl);
		} finally {
			isPending = false;
		}
	}
</script>

{#snippet deleteForm()}
	{#if role !== 'admin'}
		<Input bind:value={typedConfirm} placeholder={userEmail} disabled={isPending} />
	{/if}
{/snippet}

<ActionButton
	function={confirm}
	class="w-fit"
	variant="destructive"
	{isPending}
	actionDisabled={role === 'admin' || typedConfirm !== userEmail}
	isDestructive
	hideProceed={role === 'admin'}
	title={role === 'admin'
		? m['AdminUserPage.DeleteUserDialog.adminTitle']({ email: userEmail })
		: m['AdminUserPage.DeleteUserDialog.title']({ email: userEmail })}
	description={role === 'admin'
		? m['AdminUserPage.DeleteUserDialog.adminDescription']()
		: m['AdminUserPage.DeleteUserDialog.description']()}
	body={role !== 'admin' ? deleteForm : undefined}
>
	{m['AdminUserPage.DeleteUserDialog.delete']()}
</ActionButton>
