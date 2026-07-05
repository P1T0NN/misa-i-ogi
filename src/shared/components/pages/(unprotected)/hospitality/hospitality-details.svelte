<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	let { hospitality }: { hospitality: HospitalityDetailsSafe } = $props();
</script>

<Card.Root class="border-border/80">
	<Card.Header class="pb-2">
		<Card.Title class="font-serif text-lg">
			{m['HospitalityPage.HospitalityDetails.title']()}
		</Card.Title>
	</Card.Header>

	<Card.Content>
		<dl class="space-y-4 text-sm">
			<div>
				<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
					{m['HospitalityPage.HospitalityDetails.typeLabel']()}
				</dt>
				<dd class="mt-1">{labelHospitalityType(hospitality.type)}</dd>
			</div>
			<div>
				<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
					{m['HospitalityPage.HospitalityDetails.areaLabel']()}
				</dt>
				<dd class="mt-1">{hospitality.city}, {hospitality.country}</dd>
			</div>
		</dl>
	</Card.Content>
</Card.Root>
