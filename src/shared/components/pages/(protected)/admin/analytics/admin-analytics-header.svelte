<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
</script>

<div class="flex max-w-3xl flex-col gap-2">
	<p class="font-mono text-xs tracking-[0.14em] text-primary uppercase">
		{m['AdminAnalyticsPage.AdminAnalyticsHeader.eyebrow']()}
	</p>

	<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
		{m['AdminAnalyticsPage.AdminAnalyticsHeader.title']()}
	</h1>

	<p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
		{m['AdminAnalyticsPage.AdminAnalyticsHeader.description']()}
	</p>
</div>
