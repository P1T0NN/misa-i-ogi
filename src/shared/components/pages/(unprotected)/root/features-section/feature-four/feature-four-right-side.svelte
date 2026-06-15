<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';
</script>

<div class="max-w-2xl">
	<p class="mb-0 landing-eyebrow text-primary">Partnerships</p>

	<h2
		class="mt-4 max-w-[16ch] font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl lg:text-6xl"
	>
		Benefits from the day you register.
	</h2>

	<div class="mt-10 grid gap-8 border-t border-border-2 pt-8">
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<p class="mb-0 landing-eyebrow text-primary">
					Included with free registration
				</p>

				<Badge variant="success">Included</Badge>
			</div>

			<p class="mt-3 mb-0 max-w-136 text-base leading-relaxed text-muted-foreground">
				Register your accommodation for free and your guests instantly unlock benefits from our
				platform's partner hospitalities — real discounts at the best places nearby. No setup,
				no negotiation, guaranteed from day one.
			</p>
		</div>

		<div>
			<div class="flex flex-wrap items-center gap-2">
				<p class="mb-0 landing-eyebrow text-primary">
					Bonus — your own custom partnerships
				</p>

				<Badge variant="secondary">Optional</Badge>
			</div>

			<p class="mt-3 mb-0 max-w-136 text-base leading-relaxed text-muted-foreground">
				Want more? On top of the included benefits, you can form your own partnerships directly with
				other hospitalities, with the discounts or perks you arrange yourself.
			</p>
		</div>
	</div>

	<Link
		href="/partnerships"
		class="mt-8 inline-flex font-medium text-primary underline-offset-4 hover:underline"
	>
		Learn how partnerships work
	</Link>
</div>
