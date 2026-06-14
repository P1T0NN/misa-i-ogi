<script lang="ts">
	// LIBRARIES
	import { ArrowRight, BedDouble, Check, ConciergeBell } from '@lucide/svelte';

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
	};

	const accommodationPoints: BenefitPoint[] = [
		{
			title: 'Perks ready on day one',
			body: 'The minute you join, your guests get benefits at venues we already partner with. You do nothing.'
		},
		{
			title: 'Guests choose you first',
			body: 'A place with free perks nearby beats the one next door that offers none.'
		},
		{
			title: 'See where your guests really go',
			body: 'Go beyond a single number. See how many guests your stay sends to each venue, your top performers, and how it trends over time. Core analytics are free; Pro unlocks the deeper breakdowns.'
		},
		{
			title: 'Bring your own venue',
			body: 'Know a local spot we do not partner with yet? Pair up with them directly, one to one. Your first custom partnership is free — go Pro to add as many as you like.',
			tag: '1 free, then Pro'
		}
	];

	const hospitalityPoints: BenefitPoint[] = [
		{
			title: 'Guests are already next door',
			body: 'Not random clicks. Real people staying minutes away, deciding where to go right now.'
		},
		{
			title: 'Get in front of every stay',
			body: 'Become a partner venue and you are shown to every apartment and hotel on the platform at once.'
		},
		{
			title: 'We shape the offer for you',
			body: 'We design the guest benefit that brings nearby travelers through your door.'
		},
		{
			title: 'Everything in one place',
			body: 'Reservation requests land on your dashboard. Confirm, decline, and track no-shows.'
		}
	];
</script>

<Section
	id="owners"
	yPadding="xl"
	class="border-y border-border-2 bg-background"
	ariaLabelledby="owners-heading"
>
	<div class="mx-auto max-w-2xl text-center">
		<p class="font-mono text-xs tracking-eyebrow text-primary uppercase">For owners</p>

		<h2
			id="owners-heading"
			class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl"
		>
			What you get, in plain words.
		</h2>

		<p class="lead mx-auto mt-5 max-w-[52ch]">
			Two kinds of owners use the platform. Find the one that is you, and see exactly what you get.
		</p>
	</div>

	<div class="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
		<article class="flex flex-col rounded-3xl border border-border-2 bg-card p-6 sm:p-8">
			<div class="flex items-center justify-between gap-3">
				<div class="flex items-center gap-3">
					<span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
						<BedDouble class="size-6" aria-hidden="true" />
					</span>

					<div>
						<p class="mb-0 font-display text-2xl leading-tight text-foreground">You host guests</p>
						<p class="mb-0 text-sm text-muted-foreground">Apartments · villas · hotels</p>
					</div>
				</div>

				<Badge variant="success">Free to join</Badge>
			</div>

			<p class="mt-6 text-base leading-relaxed text-foreground">
				List your place for free. Your guests get real perks nearby — and that makes guests pick you.
			</p>

			<ul class="mt-7 space-y-5">
				{#each accommodationPoints as point (point.title)}
					<li class="flex items-start gap-3">
						<span
							class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
						>
							<Check class="size-3.5" aria-hidden="true" />
						</span>

						<div class="min-w-0">
							<div class="flex items-center gap-2">
								<p class="mb-0 text-base font-medium text-foreground">{point.title}</p>
								{#if point.tag}
									<Badge variant="secondary">{point.tag}</Badge>
								{/if}
							</div>
							<p class="mt-1 mb-0 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
						</div>
					</li>
				{/each}
			</ul>

			<Button href={UNPROTECTED_PAGE_ENDPOINTS.SIGNUP} class="mt-8 w-full sm:w-fit">
				Register free
				<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
			</Button>
		</article>

		<article class="flex flex-col rounded-3xl border border-border-2 bg-card p-6 sm:p-8">
			<div class="flex items-center gap-3">
				<span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
					<ConciergeBell class="size-6" aria-hidden="true" />
				</span>

				<div>
					<p class="mb-0 font-display text-2xl leading-tight text-foreground">You serve guests</p>
					<p class="mb-0 text-sm text-muted-foreground">Restaurants · bars · spas · tours</p>
				</div>
			</div>

			<p class="mt-6 text-base leading-relaxed text-foreground">
				Partner with us and reach guests who are already nearby — staying in the apartments and hotels
				around you.
			</p>

			<ul class="mt-7 space-y-5">
				{#each hospitalityPoints as point (point.title)}
					<li class="flex items-start gap-3">
						<span
							class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
						>
							<Check class="size-3.5" aria-hidden="true" />
						</span>

						<div class="min-w-0">
							<p class="mb-1 text-base font-medium text-foreground">{point.title}</p>
							<p class="mb-0 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
						</div>
					</li>
				{/each}
			</ul>

			<Button href="/contact" variant="outline" class="mt-8 w-full sm:w-fit">
				Become a partner venue
				<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
			</Button>
		</article>
	</div>
</Section>
