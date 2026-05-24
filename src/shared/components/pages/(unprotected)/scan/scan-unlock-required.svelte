<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
</script>

<Card.Root
	class="border-destructive/30 bg-destructive/5 gap-2 rounded-xl border p-6 text-center shadow-none"
	role="status"
>
	<Card.Title class="font-serif text-lg font-medium text-destructive">
		{m['ScanPage.ScanUnlockRequired.requiredTitle']()}
	</Card.Title>
	<Card.Description class="text-muted-foreground text-sm leading-relaxed">
		{m['ScanPage.ScanUnlockRequired.requiredBody']()}
	</Card.Description>
</Card.Root>
