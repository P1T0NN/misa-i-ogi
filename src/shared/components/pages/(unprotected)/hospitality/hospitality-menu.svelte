<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// TYPES
	import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// LUCIDE ICONS
	import UtensilsIcon from '@lucide/svelte/icons/utensils';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';

	let { hospitality }: { hospitality: HospitalityDetailsSafe } = $props();

	const hasMenu = $derived(Boolean(hospitality.menuFileUrl || hospitality.menuLink));
</script>

{#if hasMenu}
	<section class="scroll-mt-28" aria-labelledby="menu-heading">
		<h2 id="menu-heading" class="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
			{m['HospitalityPage.HospitalityMenu.title']()}
		</h2>

		<p class="mt-1 text-sm text-muted-foreground">
			{m['HospitalityPage.HospitalityMenu.sideNote']()}
		</p>

		<div class="mt-6 flex flex-wrap gap-3">
			{#if hospitality.menuFileUrl}
				<Button
					href={hospitality.menuFileUrl}
					target="_blank"
					rel="noopener noreferrer"
					variant="outline"
				>
					<UtensilsIcon data-icon="inline-start" />
					{m['HospitalityPage.HospitalityMenu.viewMenu']()}
				</Button>
			{/if}
			
			{#if hospitality.menuLink}
				<Button
					href={hospitality.menuLink}
					target="_blank"
					rel="noopener noreferrer"
					variant="outline"
				>
					<ExternalLinkIcon data-icon="inline-start" />
					{m['HospitalityPage.HospitalityMenu.viewMenuOnline']()}
				</Button>
			{/if}
		</div>
	</section>
{/if}
