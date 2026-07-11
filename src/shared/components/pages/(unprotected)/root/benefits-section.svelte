<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { ArrowRight, BedDouble, ConciergeBell } from '@lucide/svelte';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import Section from '@/shared/components/ui/section/section.svelte';

	type BenefitPoint = {
		title: string;
		body: string;
		tag?: string;
		learnMoreHref?: string;
	};

	const accommodationPoints = $derived<BenefitPoint[]>([
		{
			title: m['HomePage.BenefitsSection.accommodationPoint1Title'](),
			body: m['HomePage.BenefitsSection.accommodationPoint1Body']()
		},
		{
			title: m['HomePage.BenefitsSection.accommodationPoint2Title'](),
			body: m['HomePage.BenefitsSection.accommodationPoint2Body']()
		},
		{
			title: m['HomePage.BenefitsSection.accommodationPoint3Title'](),
			body: m['HomePage.BenefitsSection.accommodationPoint3Body']()
		},
		{
			title: m['HomePage.BenefitsSection.accommodationPoint4Title'](),
			body: m['HomePage.BenefitsSection.accommodationPoint4Body'](),
			tag: m['HomePage.BenefitsSection.comingSoon']()
		}
	]);

	const hospitalityPoints = $derived<BenefitPoint[]>([
		{
			title: m['HomePage.BenefitsSection.hospitalityPoint1Title'](),
			body: m['HomePage.BenefitsSection.hospitalityPoint1Body']()
		},
		{
			title: m['HomePage.BenefitsSection.hospitalityPoint2Title'](),
			body: m['HomePage.BenefitsSection.hospitalityPoint2Body']()
		},
		{
			title: m['HomePage.BenefitsSection.hospitalityPoint3Title'](),
			body: m['HomePage.BenefitsSection.hospitalityPoint3Body']()
		},
		{
			title: m['HomePage.BenefitsSection.hospitalityPoint4Title'](),
			body: m['HomePage.BenefitsSection.hospitalityPoint4Body']()
		}
	]);
</script>

<Section id="benefits" yPadding="xl" class="bg-background" ariaLabelledby="benefits-heading">
	<div class="mx-auto max-w-2xl text-center">
		<p class="landing-section-eyebrow text-primary">{m['HomePage.BenefitsSection.eyebrow']()}</p>

		<h2
			id="benefits-heading"
			class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
		>
			{m['HomePage.BenefitsSection.heading']()}
		</h2>

		<p class="lead mx-auto mt-5 max-w-[52ch]">
			{m['HomePage.BenefitsSection.lead']()}
		</p>
	</div>

	<div class="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
		<!-- ACCOMMODATIONS -->
		<article class="flex flex-col overflow-hidden rounded-3xl border border-border-2 bg-card">
			<div
				class="flex items-start justify-between gap-4 border-b border-border-2 bg-accent p-6 sm:p-8"
			>
				<div class="flex items-center gap-4">
					<span
						class="shadow-card-soft grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"
					>
						<BedDouble class="size-6" aria-hidden="true" />
					</span>

					<div>
						<p class="landing-eyebrow mb-1 text-primary">
							{m['HomePage.BenefitsSection.accommodationsEyebrow']()}
						</p>
						<p class="mb-0 font-display text-2xl leading-tight text-foreground">
							{m['HomePage.BenefitsSection.accommodationsTitle']()}
						</p>
						<p class="mb-0 text-sm text-muted-foreground">
							{m['HomePage.BenefitsSection.accommodationsSubtitle']()}
						</p>
					</div>
				</div>

				<Badge variant="success" class="shrink-0">
					{m['HomePage.BenefitsSection.accommodationsBadge']()}
				</Badge>
			</div>

			<div class="flex flex-1 flex-col p-6 sm:p-8">
				<p class="mb-0 text-base leading-relaxed text-foreground">
					{m['HomePage.BenefitsSection.accommodationsIntro']()}
				</p>

				<ol class="mt-7 space-y-5">
					{#each accommodationPoints as point, index (point.title)}
						<li class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 border-t border-border-2 pt-5">
							<span class="pt-1 font-mono text-sm text-primary tabular-nums">0{index + 1}</span>

							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<p class="mb-0 font-display text-lg leading-snug text-foreground">
										{point.title}
									</p>
									{#if point.tag}
										<Badge variant="secondary">{point.tag}</Badge>
									{/if}
								</div>
								<p class="mt-1.5 mb-0 text-sm leading-relaxed text-muted-foreground">
									{point.body}{#if point.learnMoreHref != null}&nbsp;<a
											href={point.learnMoreHref}
											class="font-medium text-foreground underline underline-offset-2 hover:text-primary"
											>{m['HomePage.BenefitsSection.whatIsPro']()}</a
										>{/if}
								</p>
							</div>
						</li>
					{/each}
				</ol>

				<div class="mt-auto pt-8">
					<Button href={UNPROTECTED_PAGE_ENDPOINTS.SIGNUP} class="w-full sm:w-fit">
						{m['HomePage.BenefitsSection.registerFree']()}
						<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</article>

		<!-- HOSPITALITY -->
		<article class="flex flex-col overflow-hidden rounded-3xl border border-border-2 bg-card">
			<div
				class="flex items-start justify-between gap-4 border-b border-border-2 bg-accent p-6 sm:p-8"
			>
				<div class="flex items-center gap-4">
					<span
						class="shadow-card-soft grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"
					>
						<ConciergeBell class="size-6" aria-hidden="true" />
					</span>

					<div>
						<p class="landing-eyebrow mb-1 text-primary">
							{m['HomePage.BenefitsSection.hospitalitiesEyebrow']()}
						</p>
						<p class="mb-0 font-display text-2xl leading-tight text-foreground">
							{m['HomePage.BenefitsSection.hospitalitiesTitle']()}
						</p>
						<p class="mb-0 text-sm text-muted-foreground">
							{m['HomePage.BenefitsSection.hospitalitiesSubtitle']()}
						</p>
					</div>
				</div>

				<Badge variant="success" class="shrink-0">
					{m['HomePage.BenefitsSection.hospitalitiesBadge']()}
				</Badge>
			</div>

			<div class="flex flex-1 flex-col p-6 sm:p-8">
				<p class="mb-0 text-base leading-relaxed text-foreground">
					{m['HomePage.BenefitsSection.hospitalitiesIntro']()}
				</p>

				<ol class="mt-7 space-y-5">
					{#each hospitalityPoints as point, index (point.title)}
						<li class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 border-t border-border-2 pt-5">
							<span class="pt-1 font-mono text-sm text-primary tabular-nums">0{index + 1}</span>

							<div class="min-w-0">
								<p class="mb-0 font-display text-lg leading-snug text-foreground">{point.title}</p>
								<p class="mt-1.5 mb-0 text-sm leading-relaxed text-muted-foreground">
									{point.body}
								</p>
							</div>
						</li>
					{/each}
				</ol>

				<div class="mt-auto pt-8">
					<Button
						href={UNPROTECTED_PAGE_ENDPOINTS.CONTACT}
						variant="outline"
						class="w-full sm:w-fit"
					>
						{m['HomePage.BenefitsSection.becomePartner']()}
						<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
					</Button>
					<p class="mt-3 mb-0 text-sm text-muted-foreground">
						{m['HomePage.BenefitsSection.preferDirectConversation']()}
					</p>
				</div>
			</div>
		</article>
	</div>

	<p class="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
		<span class="font-medium text-foreground">
			{m['HomePage.BenefitsSection.footerBold']()}
		</span>
		{m['HomePage.BenefitsSection.footer']()}
	</p>
</Section>
