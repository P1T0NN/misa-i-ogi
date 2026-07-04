<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from '@mmailaender/convex-svelte';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import Dialog from '@/shared/components/ui/dialog/dialog.svelte';

	// UTILS
	import { safeMutation } from '@/shared/utils/convexHelpers';
	import { toastResult } from '@/shared/utils/toastResult';
	import { formatTrialWindowLabels } from '@/features/auth/utils/formatTrialWindowLabels';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	const trialLabels = $derived.by(() => {
		if (!open) return { startDate: '', endDate: '' };
		return formatTrialWindowLabels();
	});

	// On success the root layout's `getCurrentUser` subscription picks up the new
	// trial row and `authClass` syncs across the app.
	async function startTrial() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.proTrials.mutations.startProTrial.startProTrial,
				{}
			);
			toastResult(result);
			if (result?.success) open = false;
		} finally {
			isPending = false;
		}
	}
</script>

<Dialog bind:open title={m['StartProTrialDialog.title']()}>
	<div class="flex flex-col gap-4">
		<p class="text-sm leading-relaxed text-muted-foreground">
			{m['StartProTrialDialog.description']({
				startDate: trialLabels.startDate,
				endDate: trialLabels.endDate
			})}
		</p>

		<p class="text-sm font-medium text-foreground">
			{m['StartProTrialDialog.question']()}
		</p>

		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button type="button" variant="outline" onclick={() => (open = false)} disabled={isPending}>
				{m['StartProTrialDialog.cancel']()}
			</Button>

			<Button type="button" onclick={startTrial} disabled={isPending}>
				{m['StartProTrialDialog.confirm']()}
			</Button>
		</div>
	</div>
</Dialog>
