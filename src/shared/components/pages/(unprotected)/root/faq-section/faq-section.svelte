<script lang="ts">
	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import FaqSectionItem from './faq-section-item.svelte';

	// DATA
	import { faqsData } from './data';
</script>

<Section id="faq" yPadding="xl" class="bg-background" ariaLabelledby="faq-heading">
	<div class="mx-auto max-w-2xl text-center">
		<p class="landing-section-eyebrow text-primary">Questions</p>

		<h2
			id="faq-heading"
			class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
		>
			Still wondering? Start here.
		</h2>

		<p class="lead mx-auto mt-5 max-w-[48ch]">
			The short, honest answers to what owners ask us most.
		</p>
	</div>

	<div class="mx-auto mt-12 max-w-3xl border-b border-border-2">
		{#each faqsData as faq (faq.question)}
			<FaqSectionItem {faq} />
		{/each}
	</div>
</Section>
