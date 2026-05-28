<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
</script>

<div role="alert" class="flex flex-col gap-1.5 rounded-xl border border-border/80 bg-card p-5">
	<h3 class="mb-0 font-serif text-lg font-medium">{m['StayPage.StayPartnershipsError.title']()}</h3>
	<p class="mb-0 text-sm leading-relaxed text-muted-foreground">
		{m['StayPage.StayPartnershipsError.body']()}
	</p>
</div>
