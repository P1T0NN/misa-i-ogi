<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';

	// TYPES
	import type { HospitalityPartnershipBenefit } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	let {
		partnership,
		hospitalityName
	}: {
		partnership: HospitalityPartnershipBenefit | null;
		hospitalityName: string;
	} = $props();

	const benefitTitle = $derived(
		partnership
			? (partnership.benefit ??
				(partnership.discountPercentage == null
					? m['HospitalityPage.HospitalityPartnership.genericTitle']()
					: m['HospitalityPage.HospitalityPartnership.legacyDiscountTitle']({
							percent: partnership.discountPercentage
						})))
			: ''
	);
</script>

{#if partnership}
	<Card.Root class="overflow-hidden border-primary/20 bg-accent/40">
		<Card.Header class="pb-3">
			<p class="mb-2 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
				{m['HospitalityPage.HospitalityPartnership.eyebrow']()}
			</p>

			<Card.Title class="font-serif text-3xl leading-none">{benefitTitle}</Card.Title>
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
