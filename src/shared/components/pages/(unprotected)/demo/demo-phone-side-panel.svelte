<script lang="ts">
	// COMPONENTS
	import { Button } from '@/shared/components/ui/button';
	import { ChevronLeft, ChevronRight, RotateCcw } from '@lucide/svelte';

	// DATA
	import { DEMO_NARR, DEMO_TOTAL_STEPS } from '@/shared/data/demoData';

	// TYPES
	import type { DemoPageModel } from '../../../../../routes/(unprotected)/demo/demoPage.svelte.ts';

	let { demo }: { demo: DemoPageModel } = $props();

	const narr = $derived(DEMO_NARR[demo.currentStep] ?? DEMO_NARR[1]);
	const lastStep = $derived(demo.currentStep === DEMO_TOTAL_STEPS);
</script>

<div class="pl-0 lg:pl-4">
	<p
		class="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-eyebrow text-primary sm:mb-(--gap-md)"
	>
		<span class="inline-block size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true"></span>
		<span>Step {demo.currentStep} of {DEMO_TOTAL_STEPS}</span>
	</p>

	<h2
		class="mb-4 font-display text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl"
	>
		{narr.title}
	</h2>

	<p class="mb-6 min-h-lines-5 max-w-measure-narrow text-base leading-relaxed text-muted-foreground">
		{narr.body}
	</p>

	<div
		class="mb-7 flex max-w-measure-narrow items-start gap-2.5 rounded-lg border border-(--border-2) bg-card p-3.5 text-sm"
	>
		<span
			class="mt-px shrink-0 rounded-md bg-accent px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-primary"
			>{narr.keyTag}</span
		>
		<p class="m-0 text-sm leading-normal text-muted-foreground">{narr.key}</p>
	</div>

	<div class="mb-6 flex gap-1">
		{#each Array.from({ length: DEMO_TOTAL_STEPS }, (_, i) => i + 1) as n (n)}
			<button
				type="button"
				class="h-1 min-w-0 flex-1 cursor-pointer border-0 transition-colors first:ml-0 not-first:ml-1"
				style:background={n === demo.currentStep
					? 'var(--accent)'
					: n < demo.currentStep
						? 'color-mix(in oklch, var(--accent) 50%, var(--border-2))'
						: 'var(--border-2)'}
				aria-label="Go to step {n}"
				onclick={() => demo.goTo(n)}
			></button>
		{/each}
	</div>

	<div class="flex flex-wrap gap-3">
		<Button
			variant="outline"
			class="h-auto gap-2 px-5 py-3 text-button"
			disabled={demo.currentStep === 1}
			onclick={demo.prevStep}
		>
			<ChevronLeft class="size-4" stroke-width="2" aria-hidden="true" />
			Previous
		</Button>

		<Button variant="default" class="h-auto gap-2 px-5 py-3 text-button" onclick={demo.nextStep}>
			{#if lastStep}
				<RotateCcw class="size-4" stroke-width="2" aria-hidden="true" />
				Restart demo
			{:else}
				Next step
				<ChevronRight class="size-4" stroke-width="2" aria-hidden="true" />
			{/if}
		</Button>

		<Button variant="ghost" class="h-auto px-1.5 py-3 text-button" onclick={() => demo.goTo(1)}>Reset</Button>
	</div>
</div>
