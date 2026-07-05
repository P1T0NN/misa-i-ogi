<script lang="ts">
	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	// LUCIDE ICONS
	import { ConciergeBell, Check, ArrowRight } from '@lucide/svelte';

	const hospitalityFree: string[] = [
		'List your hospitality for free',
		'Shown to every accommodation on the platform',
		'We help you shape the guest offer'
	];
</script>

<article class="flex flex-col rounded-3xl border border-border-2 bg-card p-6 sm:p-8">
	<div class="flex items-center gap-3">
		<span class="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
			<ConciergeBell class="size-5" aria-hidden="true" />
		</span>

		<p class="mb-0 font-display text-xl leading-tight text-foreground">If you serve guests</p>
	</div>

	<div class="mt-6 flex items-baseline gap-2">
		<span class="font-display text-5xl leading-none font-medium text-foreground">€0</span>
		<span class="text-base text-muted-foreground">upfront</span>
	</div>

	<ul class="mt-7 space-y-3.5">
		{#each hospitalityFree as item (item)}
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
			<p class="mb-0 text-sm font-medium text-foreground">You only pay on real results</p>
			<Badge variant="secondary">Pay as you go</Badge>
		</div>
		<p class="mt-1.5 mb-0 text-sm leading-relaxed text-muted-foreground">
			No monthly fee. When a guest actually redeems an offer, we share a small commission on that
			visit — verified, and only on guests we genuinely bring you.
		</p>
	</div>

	<div class="mt-auto pt-8">
		<Button href={UNPROTECTED_PAGE_ENDPOINTS.CONTACT} variant="outline" class="w-full sm:w-fit">
			Talk to us
			<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
		</Button>
	</div>
</article>
