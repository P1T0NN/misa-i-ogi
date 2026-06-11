<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
</script>

<div class="rounded-xl border border-border bg-card px-4 py-8 text-center" role="alert">
	<h2 class="text-lg font-semibold">{m['EditHospitalityPage.loadErrorTitle']()}</h2>
	<p class="mt-2 text-sm text-muted-foreground">
		{m['EditHospitalityPage.loadErrorDescription']()}
	</p>
</div>
