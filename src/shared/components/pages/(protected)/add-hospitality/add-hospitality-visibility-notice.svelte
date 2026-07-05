<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// LUCIDE ICONS
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
</script>

<div class="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
	<EyeOffIcon class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

	<div class="flex flex-col gap-1">
		<p class="text-sm font-medium">
			{m['AddHospitalityPage.AddHospitalityVisibilityNotice.title']()}
		</p>

		<p class="text-sm text-muted-foreground">
			{m['AddHospitalityPage.AddHospitalityVisibilityNotice.description']()}
		</p>
	</div>
</div>
