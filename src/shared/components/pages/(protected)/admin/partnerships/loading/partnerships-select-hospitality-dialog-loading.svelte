<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Spinner } from '@/shared/components/ui/spinner/index.js';
</script>

<div class="flex items-center justify-center gap-2 py-10 text-muted-foreground">
	<Spinner class="size-4" />
	<span class="text-sm">{m['AdminPartnershipAddPage.selectHospitalityLoading']()}</span>
</div>
