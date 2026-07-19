<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import FaqSectionItem from './faq-section-item.svelte';

	// TYPES
	import type { FaqItem } from './types';

	const faqsData = $derived<FaqItem[]>([
		{
			question: m['HomePage.FaqSection.q1Question'](),
			answer: m['HomePage.FaqSection.q1Answer']()
		},
		{
			question: m['HomePage.FaqSection.q2Question'](),
			answer: m['HomePage.FaqSection.q2Answer']()
		},
		{
			question: m['HomePage.FaqSection.q4Question'](),
			answer: m['HomePage.FaqSection.q4Answer']()
		},
		{
			question: m['HomePage.FaqSection.q5Question'](),
			answer: m['HomePage.FaqSection.q5Answer']()
		},
		{
			question: m['HomePage.FaqSection.q6Question'](),
			answer: m['HomePage.FaqSection.q6Answer']()
		},
		{
			question: m['HomePage.FaqSection.q7Question'](),
			answer: m['HomePage.FaqSection.q7Answer']()
		}
	]);
</script>

<Section id="faq" yPadding="xl" class="bg-background" ariaLabelledby="faq-heading">
	<div class="mx-auto max-w-2xl text-center">
		<p class="landing-section-eyebrow text-primary">{m['HomePage.FaqSection.eyebrow']()}</p>

		<h2
			id="faq-heading"
			class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
		>
			{m['HomePage.FaqSection.heading']()}
		</h2>

		<p class="lead mx-auto mt-5 max-w-[48ch]">
			{m['HomePage.FaqSection.lead']()}
		</p>
	</div>

	<div class="mx-auto mt-12 max-w-3xl border-b border-border-2">
		{#each faqsData as faq (faq.question)}
			<FaqSectionItem {faq} />
		{/each}
	</div>
</Section>
