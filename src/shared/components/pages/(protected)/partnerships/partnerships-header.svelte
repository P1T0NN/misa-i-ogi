<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';
	import { CUSTOM_PARTNERSHIP_ENABLED, SUBSCRIPTION_ENABLED } from '@/shared/config.js';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// UTILS
	import { hasProAccess } from '@/features/auth/utils/hasProAccess';

	// LUCIDE ICONS
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import CrownIcon from '@lucide/svelte/icons/crown';
	import GiftIcon from '@lucide/svelte/icons/gift';

	const access = $derived(hasProAccess(authClass.currentUser));
	const trialEndsAt = $derived(authClass.currentUser?.proTrialEndsAt ?? null);
</script>

<header class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
	<div class="flex max-w-3xl min-w-0 flex-col gap-2">
		{#if SUBSCRIPTION_ENABLED && access !== null}
			<div class="flex flex-wrap items-center gap-2">
				{#if access === 'pro'}
					<Badge variant="default">
						<SparklesIcon class="size-3" aria-hidden="true" />
						{m['PartnershipsPage.PartnershipsHeader.proBadge']()}
					</Badge>
				{:else if access === 'trial-available'}
					<Badge variant="outline">
						<GiftIcon class="size-3" aria-hidden="true" />
						{m['PartnershipsPage.PartnershipsHeader.trialAvailableBadge']()}
					</Badge>
				{:else if access === 'trial-active' && trialEndsAt !== null}
					<Badge variant="outline">
						<GiftIcon class="size-3" aria-hidden="true" />
						{m['PartnershipsPage.PartnershipsHeader.trialActiveBadge']({
							date: new Date(trialEndsAt).toLocaleDateString()
						})}
					</Badge>
				{:else if access === 'trial-expired'}
					<Badge variant="secondary">
						<CrownIcon class="size-3" aria-hidden="true" />
						{m['PartnershipsPage.PartnershipsHeader.trialEndedBadge']()}
					</Badge>
				{/if}
			</div>
		{/if}

		<div>
			<h1 class="text-2xl font-semibold tracking-tight">
				{m['PartnershipsPage.PartnershipsHeader.title']()}
			</h1>
			<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
				{m['PartnershipsPage.PartnershipsHeader.description']()}
			</p>
		</div>
	</div>

	{#if CUSTOM_PARTNERSHIP_ENABLED}
		<Button
			href={PROTECTED_PAGE_ENDPOINTS.CREATE_CUSTOM_PARTNERSHIP}
			class="w-full shrink-0 sm:w-auto sm:self-center"
		>
			<PlusIcon data-icon="inline-start" />
			{m['PartnershipsPage.PartnershipsHeader.createCustomPartnership']()}
		</Button>
	{/if}
</header>
