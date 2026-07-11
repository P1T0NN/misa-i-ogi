<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import CustomCarousel from '@/shared/components/ui/custom-carousel/custom-carousel.svelte';
	import PhoneMockup from '@/shared/components/ui/phone-mockup/phone-mockup.svelte';
	import Section from '@/shared/components/ui/section/section.svelte';

	type FlowStep = {
		kicker: string;
		title: string;
		body: string;
		image: string;
		/** Photos fill the screen (cover); UI screenshots fit without cropping (contain, default). */
		fit?: 'cover' | 'contain';
	};

	const flowSteps = $derived([
		{
			kicker: '01',
			title: m['HomePage.GuestFlowSection.step1Title'](),
			body: m['HomePage.GuestFlowSection.step1Body'](),
			image: '/images/landing/flow-section/step1.png',
			fit: 'cover'
		},
		{
			kicker: '02',
			title: m['HomePage.GuestFlowSection.step2Title'](),
			body: m['HomePage.GuestFlowSection.step2Body'](),
			image: '/images/landing/flow-section/step2.png'
		},
		{
			kicker: '03',
			title: m['HomePage.GuestFlowSection.step3Title'](),
			body: m['HomePage.GuestFlowSection.step3Body'](),
			image: '/images/landing/flow-section/step3.png'
		},
		{
			kicker: '04',
			title: m['HomePage.GuestFlowSection.step4Title'](),
			body: m['HomePage.GuestFlowSection.step4Body'](),
			image: '/images/landing/flow-section/step4.png'
		},
		{
			kicker: '05',
			title: m['HomePage.GuestFlowSection.step5Title'](),
			body: m['HomePage.GuestFlowSection.step5Body'](),
			image: '/images/landing/flow-section/step5.png'
		},
		{
			kicker: '06',
			title: m['HomePage.GuestFlowSection.step6Title'](),
			body: m['HomePage.GuestFlowSection.step6Body'](),
			image: '/images/landing/flow-section/step6.png'
		}
	] satisfies FlowStep[]);

	function getStepKey(step: FlowStep) {
		return step.kicker;
	}

	function getStepDotLabel(_step: FlowStep, index: number) {
		return m['HomePage.GuestFlowSection.goToStep']({ step: index + 1 });
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
			<p class="landing-section-eyebrow text-primary">{m['HomePage.GuestFlowSection.eyebrow']()}</p>
			<h2
				id="guest-flow-heading"
				class="mt-4 max-w-[15ch] font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
			>
				{m['HomePage.GuestFlowSection.heading']()}
			</h2>
		</div>
		<p class="lead max-w-[58ch] lg:justify-self-end">
			{m['HomePage.GuestFlowSection.lead']()}
		</p>
	</div>

	<CustomCarousel
		items={flowSteps}
		getKey={getStepKey}
		getDotLabel={getStepDotLabel}
		ariaLabel={m['HomePage.GuestFlowSection.carouselAriaLabel']()}
		previousLabel={m['HomePage.GuestFlowSection.previousStep']()}
		nextLabel={m['HomePage.GuestFlowSection.nextStep']()}
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
								class="size-full bg-background {step.fit === 'cover'
									? 'object-cover object-center'
									: 'object-contain object-top'}"
								loading={index === 0 ? 'eager' : 'lazy'}
								decoding="async"
							/>
						{/snippet}
					</PhoneMockup>
				</div>

				<div
					class="flex min-h-[24rem] w-full max-w-full min-w-0 flex-col justify-center overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12"
				>
					<p class="landing-eyebrow mb-0 text-primary">
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
						<p class="landing-eyebrow mb-0 text-muted-foreground">
							{m['HomePage.GuestFlowSection.stepProgress']({
								current: index + 1,
								total: flowSteps.length
							})}
						</p>
					</div>
				</div>
			</article>
		{/snippet}
	</CustomCarousel>
</Section>
