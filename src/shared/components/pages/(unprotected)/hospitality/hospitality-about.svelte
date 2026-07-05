<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// TYPES
	import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	let { hospitality }: { hospitality: HospitalityDetailsSafe } = $props();
</script>

<section class="scroll-mt-28" aria-labelledby="about-heading">
	<h2 id="about-heading" class="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
		{m['HospitalityPage.HospitalityAbout.title']()}
	</h2>

	<p class="mt-1 text-sm text-muted-foreground">
		{m['HospitalityPage.HospitalityAbout.sideNote']()}
	</p>

	<p class="mt-6 max-w-prose text-base leading-relaxed whitespace-pre-wrap text-foreground/95">
		{hospitality.description}
	</p>
</section>
