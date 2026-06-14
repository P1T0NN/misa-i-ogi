<script lang="ts">
	// COMPONENTS
	import CustomCarousel from '@/shared/components/ui/custom-carousel/custom-carousel.svelte';
	import PhoneMockup from '@/shared/components/ui/phone-mockup/phone-mockup.svelte';
	import Section from '@/shared/components/ui/section/section.svelte';

	type FlowStep = {
		kicker: string;
		title: string;
		body: string;
		image: string;
	};

	const flowSteps = $derived([
		{
			kicker: '01',
			title: 'QR code waits in the accommodation',
			body: 'A guest arrives and finds one QR card inside the stay. No app, no account, no reception explanation needed.',
			image: '/images/landing/flow-section/step1.png'
		},
		{
			kicker: '02',
			title: 'Guest opens the stay benefits page',
			body: 'The page is tied to that accommodation and shows benefits selected for that exact stay.',
			image: '/images/landing/flow-section/step2.png'
		},
		{
			kicker: '03',
			title: 'Guest selects a hospitality partner',
			body: 'They open a partner page, check the offer, location, and details, then decide if it fits their plan.',
			image: '/images/landing/flow-section/step3.png'
		},
		{
			kicker: '04',
			title: 'Guest requests a reservation',
			body: 'If reservations are enabled, the guest sends a short request with name, guest count, time, phone, and optional email.',
			image: '/images/landing/flow-section/step4.png'
		},
		{
			kicker: '05',
			title: 'The request is sent and tracked',
			body: 'The hospitality owner receives the request, contacts the guest if needed, then confirms or declines it from the dashboard.',
			image: '/images/landing/flow-section/step5.png'
		},
		{
			kicker: '06',
			title: 'Hospitality owner confirms the reservation',
			body: 'The guest sees the reservation confirmed, and the hospitality owner has the visit recorded in the dashboard.',
			image: '/images/landing/flow-section/step6.png'
		}
	] satisfies FlowStep[]);

	function getStepKey(step: FlowStep) {
		return step.kicker;
	}

	function getStepDotLabel(_step: FlowStep, index: number) {
		return `Go to step ${index + 1}`;
	}
</script>

<Section
	id="guest-flow"
	yPadding="xl"
	class="border-t border-border-2 bg-muted"
	ariaLabelledby="guest-flow-heading"
>
	<div class="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-end">
		<div>
			<p class="font-mono text-xs tracking-eyebrow text-primary uppercase">Guest flow</p>
			<h2
				id="guest-flow-heading"
				class="mt-4 max-w-[15ch] font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
			>
				From room scan to confirmed reservation.
			</h2>
		</div>
		<p class="lead max-w-[58ch] lg:justify-self-end">
			The entire journey is visible, short, and understandable. No download, no guest account, no
			confusing handoff.
		</p>
	</div>

	<CustomCarousel
		items={flowSteps}
		getKey={getStepKey}
		getDotLabel={getStepDotLabel}
		ariaLabel="Guest flow"
		previousLabel="Previous step"
		nextLabel="Next step"
		class="mt-14"
		viewportClass="rounded-[2rem] border border-border-2 bg-card"
	>
		{#snippet children(step, index)}
			<article
				class="grid min-h-[43rem] w-full max-w-full min-w-0 overflow-hidden bg-card lg:grid-cols-[minmax(0,0.98fr)_minmax(0,0.82fr)]"
			>
				<div
					class="relative grid min-h-[38rem] w-full max-w-full min-w-0 place-items-center overflow-hidden border-b border-border-2 bg-dark/55 px-4 py-7 sm:min-h-[43rem] sm:px-8 lg:border-r lg:border-b-0"
				>
					<div
						class="pointer-events-none absolute inset-x-10 top-10 h-44 rounded-full bg-primary/10 blur-3xl"
						aria-hidden="true"
					></div>
					<PhoneMockup
						stageClass="relative z-10 w-full py-0"
						chassisClass="aspect-[10/19.5] w-[min(17rem,calc(100vw-4rem))] sm:w-[min(20rem,100%)]"
						screenClass="bg-background"
						showGlow={false}
					>
						{#snippet screens()}
							<img
								src={step.image}
								alt={step.title}
								class="size-full bg-background object-contain object-top"
								loading={index === 0 ? 'eager' : 'lazy'}
								decoding="async"
							/>
						{/snippet}
					</PhoneMockup>
				</div>

				<div
					class="flex min-h-[24rem] w-full max-w-full min-w-0 flex-col justify-center overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12"
				>
					<p class="mb-0 font-mono text-xs tracking-caps text-primary">
						{step.kicker} / 0{flowSteps.length}
					</p>
					<h3
						class="mt-5 w-full max-w-[14ch] min-w-0 font-display text-4xl leading-tight font-medium text-wrap break-words text-foreground sm:text-5xl lg:text-6xl"
					>
						{step.title}
					</h3>
					<p
						class="mt-6 mb-0 w-full max-w-[46ch] min-w-0 text-base leading-relaxed break-words text-muted-foreground sm:text-lg"
					>
						{step.body}
					</p>

					<div class="mt-10 border-t border-border-2 pt-5">
						<p class="mb-0 font-mono text-xs tracking-caps text-muted-foreground uppercase">
							Step {index + 1} of {flowSteps.length}
						</p>
					</div>
				</div>
			</article>
		{/snippet}
	</CustomCarousel>
</Section>
