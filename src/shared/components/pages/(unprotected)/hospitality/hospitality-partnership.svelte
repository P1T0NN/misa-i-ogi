<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';

	// TYPES
	import type { PartnershipBenefitSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

	let {
		partnership,
		hospitalityName
	}: {
		partnership: PartnershipBenefitSafe | null;
		hospitalityName: string;
	} = $props();
</script>

{#if partnership}
	<Card.Root class="overflow-hidden border-primary/20 bg-accent/40">
		<Card.Header class="pb-3">
			<p class="mb-2 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
				{m['HospitalityPage.HospitalityPartnership.eyebrow']()}
			</p>

			<Card.Title class="font-serif text-3xl leading-none">{partnership?.benefit}</Card.Title>
		</Card.Header>

		<Card.Content class="space-y-3">
			<p class="text-sm leading-relaxed text-muted-foreground">
				{m['HospitalityPage.HospitalityPartnership.body']({ hospitalityName })}
			</p>

			<p class="border-t border-primary/15 pt-3 text-xs leading-relaxed text-muted-foreground">
				{m['HospitalityPage.HospitalityPartnership.sourceNote']()}
			</p>
		</Card.Content>
	</Card.Root>
{/if}
