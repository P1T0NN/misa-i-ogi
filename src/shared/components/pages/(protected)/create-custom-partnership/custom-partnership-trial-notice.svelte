<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// LUCIDE ICONS
	import CrownIcon from '@lucide/svelte/icons/crown';
</script>

<div class="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
	<CrownIcon class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

	<div class="flex flex-col gap-1">
		<p class="text-sm font-medium">
			{m['CreateCustomPartnershipPage.CustomPartnershipTrialNotice.title']()}
		</p>

		<p class="text-sm text-muted-foreground">
			{m['CreateCustomPartnershipPage.CustomPartnershipTrialNotice.description']()}
		</p>
	</div>
</div>
