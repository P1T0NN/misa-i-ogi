<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import ActionButton from '@/shared/components/ui/action-button/action-button.svelte';

	// UTILS
	import { safeMutation } from '@/shared/utils/convexHelpers';
	import { toastResult } from '@/shared/utils/toastResult';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';

	let {
		hospitalityId,
		name,
		createType
	}: {
		hospitalityId: Id<'hospitalities'>;
		name: string;
		createType?: 'platform' | 'user';
	} = $props();

	const convex = useConvexClient();
	let isPending = $state(false);

	// Missing = platform (legacy rows are all admin-created, backfilled to platform).
	const isPlatform = $derived((createType ?? 'platform') === 'platform');

	async function convert() {
		isPending = true;
		try {
			const result = await safeMutation(
				convex,
				api.tables.hospitalities.mutations.setHospitalityCreateType.setHospitalityCreateType,
				{ hospitalityId, createType: isPlatform ? 'user' : 'platform' }
			);
			toastResult(result);
		} finally {
			isPending = false;
		}
	}
</script>

<div class="rounded-xl border border-border bg-card p-4 md:p-6">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex min-w-0 flex-col gap-1.5">
			<div class="flex items-center gap-2">
				<h2 class="text-base font-semibold">
					{m['AdminEditHospitalityPage.CreateType.title']()}
				</h2>
				{#if isPlatform}
					<Badge variant="success">{m['AdminEditHospitalityPage.CreateType.platform']()}</Badge>
				{:else}
					<Badge variant="secondary">{m['AdminEditHospitalityPage.CreateType.custom']()}</Badge>
				{/if}
			</div>
			<p class="text-sm text-muted-foreground">
				{isPlatform
					? m['AdminEditHospitalityPage.CreateType.platformDescription']()
					: m['AdminEditHospitalityPage.CreateType.customDescription']()}
			</p>
		</div>
		<ActionButton
			function={convert}
			variant="outline"
			{isPending}
			title={isPlatform
				? m['AdminEditHospitalityPage.CreateType.toCustomTitle']({ name })
				: m['AdminEditHospitalityPage.CreateType.toPlatformTitle']({ name })}
			description={isPlatform
				? m['AdminEditHospitalityPage.CreateType.toCustomDescription']()
				: m['AdminEditHospitalityPage.CreateType.toPlatformDescription']()}
		>
			{isPlatform
				? m['AdminEditHospitalityPage.CreateType.toCustom']()
				: m['AdminEditHospitalityPage.CreateType.toPlatform']()}
		</ActionButton>
	</div>
</div>
