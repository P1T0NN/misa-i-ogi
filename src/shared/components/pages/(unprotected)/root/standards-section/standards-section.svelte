<script lang="ts">
	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import StandardsSectionItem from './standards-section-item.svelte';

	const items = [
		'Walking-distance-first recommendations.',
		'Real benefits staff can honor in person.',
		'No guest app, account, or login wall.',
		'Property-specific partner lists, never an ad-ranked directory.'
	];
</script>

<!-- The page's dark chapter: the editorial policy that earns the word "premium". -->
<Section
	id="trust-standards"
	yPadding="xl"
	class="bg-dark text-ivory"
	containerClass="max-w-5xl"
	ariaLabelledby="trust-standards-heading"
>
	<p class="landing-section-eyebrow text-accent-2">The standard</p>

	<h2
		id="trust-standards-heading"
		class="mt-5 font-display text-4xl leading-tight font-medium text-ivory sm:text-5xl"
	>
		Curated means both sides look good.
	</h2>
	
	<p class="mt-3 max-w-[52ch] text-lg leading-relaxed text-silver">
		If a partnership does not improve the guest experience and send the right kind of demand to the
		hospitality partner, it does not belong on the page.
	</p>

	<ol class="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2">
		{#each items as item, index (item)}
			<StandardsSectionItem {item} {index} />
		{/each}
	</ol>
</Section>
