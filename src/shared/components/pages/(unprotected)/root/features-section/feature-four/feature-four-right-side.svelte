<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';
</script>

<div class="max-w-2xl">
	<p class="landing-eyebrow mb-0 text-primary">{m['HomePage.FeatureFourRightSide.eyebrow']()}</p>

	<h2
		class="mt-4 max-w-[16ch] font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl lg:text-6xl"
	>
		{m['HomePage.FeatureFourRightSide.heading']()}
	</h2>

	<div class="mt-10 grid gap-8 border-t border-border-2 pt-8">
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<p class="landing-eyebrow mb-0 text-primary">
					{m['HomePage.FeatureFourRightSide.includedEyebrow']()}
				</p>

				<Badge variant="success">{m['HomePage.FeatureFourRightSide.includedBadge']()}</Badge>
			</div>

			<p class="mt-3 mb-0 max-w-136 text-base leading-relaxed text-muted-foreground">
				{m['HomePage.FeatureFourRightSide.includedBody']()}
			</p>
		</div>

		<div>
			<div class="flex flex-wrap items-center gap-2">
				<p class="landing-eyebrow mb-0 text-primary">
					{m['HomePage.FeatureFourRightSide.customEyebrow']()}
				</p>

				<Badge variant="secondary">{m['HomePage.FeatureFourRightSide.customBadge']()}</Badge>
			</div>

			<p class="mt-3 mb-0 max-w-136 text-base leading-relaxed text-muted-foreground">
				{m['HomePage.FeatureFourRightSide.customBody']()}
			</p>
		</div>
	</div>

	<Link
		href="/partnerships"
		class="mt-8 inline-flex font-medium text-primary underline-offset-4 hover:underline"
	>
		{m['HomePage.FeatureFourRightSide.learnMore']()}
	</Link>
</div>
