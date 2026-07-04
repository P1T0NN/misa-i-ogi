<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import StartProTrialDialog from '@/features/auth/components/start-pro-trial-dialog/start-pro-trial-dialog.svelte';

	// TYPES
	import type { ProAccess } from '@/convex/auth/types/types';

	// LUCIDE ICONS
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import CrownIcon from '@lucide/svelte/icons/crown';

	let { access }: { access: Extract<ProAccess, 'trial-available' | 'trial-expired'> } = $props();

	let trialDialogOpen = $state(false);
</script>

{#if access === 'trial-available'}
	<div
		class="flex flex-col items-center gap-4 rounded-lg border border-border bg-muted/50 p-6 text-center sm:p-8"
	>
		<div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
			<SparklesIcon class="size-5 text-primary" aria-hidden="true" />
		</div>

		<div class="flex max-w-md flex-col gap-2">
			<h2 class="text-lg font-semibold tracking-tight">
				{m['AddHospitalityPage.AddHospitalityAccessNotice.title']()}
			</h2>

			<p class="text-sm leading-relaxed text-muted-foreground">
				{m['AddHospitalityPage.AddHospitalityAccessNotice.description']()}
			</p>
		</div>

		<Button onclick={() => (trialDialogOpen = true)} class="w-full sm:w-auto">
			<SparklesIcon data-icon="inline-start" />
			{m['AddHospitalityPage.AddHospitalityAccessNotice.startTrial']()}
		</Button>

		<p class="text-xs text-muted-foreground">
			{m['AddHospitalityPage.AddHospitalityAccessNotice.noCreditCard']()}
		</p>
	</div>

	<StartProTrialDialog bind:open={trialDialogOpen} />
{:else}
	<div class="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
		<CrownIcon class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

		<div class="flex flex-col gap-1">
			<p class="text-sm font-medium">
				{m['AddHospitalityPage.AddHospitalityAccessNotice.expiredTitle']()}
			</p>

			<p class="text-sm text-muted-foreground">
				{m['AddHospitalityPage.AddHospitalityAccessNotice.expiredDescription']()}
			</p>
		</div>
	</div>
{/if}
