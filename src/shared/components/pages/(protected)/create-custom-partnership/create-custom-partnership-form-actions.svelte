<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	let {
		busy = false,
		showTrialHint = false,
		isOwnVenue = false,
		submitDisabled = false
	}: {
		busy?: boolean;
		showTrialHint?: boolean;
		isOwnVenue?: boolean;
		submitDisabled?: boolean;
	} = $props();
</script>

<div class="flex w-full flex-col gap-2">
	<Button type="submit" class="w-full" disabled={busy || submitDisabled}>
		{#if isOwnVenue}
			{m['CreateCustomPartnershipPage.CreateCustomPartnershipFormActions.submitConnect']()}
		{:else}
			{m['CreateCustomPartnershipPage.CreateCustomPartnershipFormActions.submitRequest']()}
		{/if}
	</Button>

	{#if showTrialHint}
		<p class="text-center text-xs text-muted-foreground">
			{m['CreateCustomPartnershipPage.CreateCustomPartnershipFormActions.trialHint']()}
		</p>
	{/if}

	<p class="text-center text-xs text-muted-foreground">
		{#if isOwnVenue}
			{m['CreateCustomPartnershipPage.CreateCustomPartnershipFormActions.hintOwnVenue']()}
		{:else}
			{m['CreateCustomPartnershipPage.CreateCustomPartnershipFormActions.hint']()}
		{/if}
	</p>
</div>
