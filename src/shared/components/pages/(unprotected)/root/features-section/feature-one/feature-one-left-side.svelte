<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
</script>

<div class="max-w-2xl">
	<p class="landing-eyebrow mb-0 text-primary">{m['HomePage.FeatureOneLeftSide.eyebrow']()}</p>

	<h2
		class="mt-4 max-w-[13ch] font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl lg:text-6xl"
	>
		{m['HomePage.FeatureOneLeftSide.heading']()}
	</h2>

	<div class="mt-10 grid gap-8 border-t border-border-2 pt-8">
		<div>
			<p class="landing-eyebrow mb-0 text-primary">
				{m['HomePage.FeatureOneLeftSide.accommodationEyebrow']()}
			</p>

			<p class="mt-3 mb-0 max-w-136 text-base leading-relaxed text-muted-foreground">
				{m['HomePage.FeatureOneLeftSide.accommodationBody']()}
			</p>
		</div>

		<div>
			<p class="landing-eyebrow mb-0 text-primary">
				{m['HomePage.FeatureOneLeftSide.hospitalityEyebrow']()}
			</p>

			<p class="mt-3 mb-0 max-w-136 text-base leading-relaxed text-muted-foreground">
				{m['HomePage.FeatureOneLeftSide.hospitalityBody']()}
			</p>
		</div>
	</div>
</div>
