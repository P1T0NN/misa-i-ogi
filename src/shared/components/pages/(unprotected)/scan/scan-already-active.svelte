<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';

	let {
		variant = 'standalone'
	}: {
		/** `reminder` — compact banner when perks are already visible; `standalone` — full card. */
		variant?: 'reminder' | 'standalone';
	} = $props();

	const isReminder = $derived(variant === 'reminder');
</script>

<Card.Root
	class={isReminder
		? 'border-primary/30 bg-primary/5 gap-2 rounded-xl border p-4 shadow-none'
		: 'border-destructive/30 bg-destructive/5 gap-2 rounded-xl border p-6 text-center shadow-none'}
	role="status"
>
	<Card.Title
		class={isReminder
			? 'font-serif text-base font-medium text-foreground'
			: 'font-serif text-lg font-medium text-destructive'}
	>
		{m['ScanPage.ScanAlreadyActive.title']()}
	</Card.Title>
	<Card.Description class="text-muted-foreground text-sm leading-relaxed">
		{isReminder
			? m['ScanPage.ScanAlreadyActive.body']()
			: m['ScanPage.ScanAlreadyActive.lockedBody']()}
	</Card.Description>
</Card.Root>
