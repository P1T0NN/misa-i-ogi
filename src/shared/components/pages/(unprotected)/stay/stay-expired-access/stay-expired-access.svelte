<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
</script>

<div class="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
	<header class="flex flex-col gap-3">
		<h1
			class="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl"
		>
			{m['StayPage.StayExpiredAccess.eyebrow']()}
		</h1>

		<Card.Root
			class="gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center shadow-none"
			role="status"
		>
			<Card.Title class="font-serif text-lg font-medium text-destructive">
				{m['StayPage.StayExpiredAccess.title']()}
			</Card.Title>
			<Card.Description class="text-sm leading-relaxed text-muted-foreground">
				{m['StayPage.StayExpiredAccess.body']()}
			</Card.Description>
		</Card.Root>
	</header>
</div>
