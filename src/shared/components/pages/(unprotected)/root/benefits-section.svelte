<script lang="ts">
	// LIBRARIES
	import { ArrowRight, BedDouble, ConciergeBell } from '@lucide/svelte';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

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

	const accommodationPoints: BenefitPoint[] = [
		{
			title: 'Perks ready on day one',
			body: 'The minute you join, your guests get real benefits at the hospitalities we already partner with. You set nothing up — it works from arrival.'
		},
		{
			title: 'Better reviews, more bookings',
			body: 'Guests who arrive to a free local perk rate their accommodation higher. Better reviews bring more bookings. It compounds over every season.'
		},
		{
			title: 'Guests pick you first',
			body: 'An accommodation with real perks nearby beats the one next door that offers nothing. Give them a reason before they even arrive.'
		},
		{
			title: 'Bring your own hospitality',
			body: 'Know a local spot we do not partner with yet? Pair up with them directly, one to one. Your first custom partnership is free — our seasonal plan unlocks as many as you like (terms may vary by country).',
			tag: '1 free, then Pro',
			learnMoreHref: '#pricing'
		}
	];

	const hospitalityPoints: BenefitPoint[] = [
		{
			title: 'Guests are already next door',
			body: 'Not random clicks. Real people staying minutes away, deciding where to go right now.'
		},
		{
			title: 'Get in front of every accommodation',
			body: 'Become a partner hospitality and you are shown to every apartment and hotel on the platform at once — automatically, without chasing each one.'
		},
		{
			title: 'You control the offer, we bring the guests',
			body: 'We work with you to design a perk that fills your quiet hours. You approve it, you honor it — no surprises, nothing imposed.'
		},
		{
			title: 'Pay only when guests actually show up',
			body: 'No upfront fee, no monthly bill. Our commission is tied to real, verified redemptions — nothing we cannot both see and count.'
		}
	];
</script>

<Section id="benefits" yPadding="xl" class="bg-background" ariaLabelledby="benefits-heading">
	<div class="mx-auto max-w-2xl text-center">
		<p class="landing-section-eyebrow text-primary">For owners</p>

		<h2
			id="benefits-heading"
			class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
		>
			What you get, in plain words.
		</h2>

		<p class="lead mx-auto mt-5 max-w-[52ch]">
			Two kinds of owners use the platform. Find the one that is you, and read straight down the
			list.
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
						<p class="landing-eyebrow mb-1 text-primary">For accommodations</p>
						<p class="mb-0 font-display text-2xl leading-tight text-foreground">You host guests</p>
						<p class="mb-0 text-sm text-muted-foreground">Apartments · villas · hotels</p>
					</div>
				</div>

				<Badge variant="success" class="shrink-0">Free to join</Badge>
			</div>

			<div class="flex flex-1 flex-col p-6 sm:p-8">
				<p class="mb-0 text-base leading-relaxed text-foreground">
					List your place for free. Your guests get real perks nearby — and that makes guests pick
					you.
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
											>What is Pro?</a
										>{/if}
								</p>
							</div>
						</li>
					{/each}
				</ol>

				<div class="mt-auto pt-8">
					<Button href={UNPROTECTED_PAGE_ENDPOINTS.SIGNUP} class="w-full sm:w-fit">
						Register free
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
						<p class="landing-eyebrow mb-1 text-primary">For hospitalities</p>
						<p class="mb-0 font-display text-2xl leading-tight text-foreground">You serve guests</p>
						<p class="mb-0 text-sm text-muted-foreground">Restaurants · bars · spas · tours</p>
					</div>
				</div>

				<Badge variant="success" class="shrink-0">No upfront cost</Badge>
			</div>

			<div class="flex flex-1 flex-col p-6 sm:p-8">
				<p class="mb-0 text-base leading-relaxed text-foreground">
					Partner with us and reach guests who are already nearby — staying in the apartments and
					hotels around you.
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
						Become a partner hospitality
						<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
					</Button>
					<p class="mt-3 mb-0 text-sm text-muted-foreground">
						Prefer a direct conversation? Reach us on Viber or WhatsApp.
					</p>
				</div>
			</div>
		</article>
	</div>

	<p class="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
		<span class="font-medium text-foreground"
			>Free for hosts, pay-per-result for hospitalities.</span
		>
		Each side makes the other more valuable — and that balance is the whole platform.
	</p>
</Section>
