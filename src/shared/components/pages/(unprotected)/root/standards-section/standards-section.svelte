<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import StandardsSectionItem from './standards-section-item.svelte';

	const items = $derived([
		m['HomePage.StandardsSection.item1'](),
		m['HomePage.StandardsSection.item2'](),
		m['HomePage.StandardsSection.item3'](),
		m['HomePage.StandardsSection.item4']()
	]);
</script>

<!-- The page's dark chapter: the editorial policy that earns the word "premium". -->
<Section
	id="trust-standards"
	yPadding="xl"
	class="bg-dark text-ivory"
	containerClass="max-w-5xl"
	ariaLabelledby="trust-standards-heading"
>
	<p class="landing-section-eyebrow text-accent-2">{m['HomePage.StandardsSection.eyebrow']()}</p>

	<h2
		id="trust-standards-heading"
		class="mt-5 font-display text-4xl leading-tight font-medium text-ivory sm:text-5xl"
	>
		{m['HomePage.StandardsSection.heading']()}
	</h2>

	<p class="mt-3 max-w-[52ch] text-lg leading-relaxed text-silver">
		{m['HomePage.StandardsSection.lead']()}
	</p>

	<ol class="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2">
		{#each items as item, index (item)}
			<StandardsSectionItem {item} {index} />
		{/each}
	</ol>
</Section>
