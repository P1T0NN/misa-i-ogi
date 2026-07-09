<script lang="ts">
	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import { BedDouble, Check, ArrowRight } from '@lucide/svelte';

	const accommodationFree: string[] = [
		'Guest perks from platform partners, from day one',
		'Full analytics — every scan, activation, and reservation'
	];
</script>

<article class="flex flex-col rounded-3xl border border-border-2 bg-card p-6 sm:p-8">
	<div class="flex items-center gap-3">
		<span class="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
			<BedDouble class="size-5" aria-hidden="true" />
		</span>
		<p class="mb-0 font-display text-xl leading-tight text-foreground">If you host guests</p>
	</div>

	<div class="mt-6 flex items-baseline gap-2">
		<span class="font-display text-5xl leading-none font-medium text-foreground">Free</span>
		<span class="text-base text-muted-foreground">forever</span>
	</div>

	<ul class="mt-7 space-y-3.5">
		{#each accommodationFree as item (item)}
			<li class="flex items-start gap-3">
				<span
					class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/10 text-success"
				>
					<Check class="size-3.5" aria-hidden="true" />
				</span>
				<span class="text-sm leading-relaxed text-foreground">{item}</span>
			</li>
		{/each}
	</ul>

	<div class="mt-7 border-t border-border-2 pt-5">
		<div class="flex items-center gap-2">
			<p class="mb-0 text-sm font-medium text-foreground">Custom partnerships</p>
			<Badge variant="secondary">Coming soon</Badge>
		</div>
		<p class="mt-1.5 mb-0 text-sm leading-relaxed text-muted-foreground">
			Forming your own partnerships directly with other hospitalities is on our roadmap. Pricing for
			that feature has not been set yet — everything above stays free either way.
		</p>
	</div>

	<div class="mt-auto pt-8">
		<Button href={UNPROTECTED_PAGE_ENDPOINTS.SIGNUP} class="w-full sm:w-fit">
			Register free
			<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
		</Button>
	</div>
</article>
