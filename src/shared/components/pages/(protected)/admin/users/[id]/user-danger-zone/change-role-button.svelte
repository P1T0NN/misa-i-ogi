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
	 * Admin-only promote/demote control for this app’s two-role model (`user` ↔ `admin`).
	 * Convex call, copy, and pending state stay in this file so the danger zone layout
	 * does not own mutation wiring for a single nested action.
	 */
	let {
		userId,
		userEmail,
		role
	}: {
		userId: string;
		userEmail: string;
		role: string;
	} = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	const demoting = $derived(role === 'admin');

	async function confirmRoleChange() {
		const nextRole = role === 'admin' ? 'user' : 'admin';
		isPending = true;
		try {
			const result = await safeMutation(convex, api.tables.users.userMutations.setUserRole, {
				userId,
				role: nextRole
			});
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

{#if demoting}
	<ActionButton
		function={confirmRoleChange}
		variant="outline"
		{isPending}
		title={m['AdminUserPage.ChangeRoleButton.demoteTitle']({ email: userEmail })}
		description={m['AdminUserPage.ChangeRoleButton.demoteDescription']()}
	>
		{m['AdminUserPage.ChangeRoleButton.demote']()}
	</ActionButton>
{:else}
	<ActionButton
		function={confirmRoleChange}
		variant="outline"
		{isPending}
		title={m['AdminUserPage.ChangeRoleButton.promoteTitle']({ email: userEmail })}
		description={m['AdminUserPage.ChangeRoleButton.promoteDescription']()}
	>
		{m['AdminUserPage.ChangeRoleButton.promote']()}
	</ActionButton>
{/if}
