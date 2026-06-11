<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import Link from '@/shared/components/ui/link/link.svelte';
	import { buttonVariants } from '@/shared/components/ui/button/index.js';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// LUCIDE ICONS
	import HomeIcon from '@lucide/svelte/icons/home';
</script>

<Section yPadding="xl" containerClass="flex flex-col items-center gap-4 text-center">
	<HomeIcon class="size-12 text-muted-foreground" aria-hidden="true" />

	<h1 class="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
		{m['StayPage.StayEmpty.title']()}
	</h1>

	<p class="max-w-md text-muted-foreground">{m['StayPage.StayEmpty.body']()}</p>

	<Link href={UNPROTECTED_PAGE_ENDPOINTS.ROOT} class={cn(buttonVariants({ size: 'lg' }))}>
		{m['StayPage.StayEmpty.cta']()}
	</Link>
</Section>
