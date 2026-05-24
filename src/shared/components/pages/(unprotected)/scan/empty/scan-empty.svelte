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
	<HomeIcon class="text-muted-foreground size-12" aria-hidden="true" />

	<h1 class="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
		{m['ScanPage.ScanEmpty.title']()}
	</h1>

	<p class="text-muted-foreground max-w-md">{m['ScanPage.ScanEmpty.body']()}</p>

	<Link href={UNPROTECTED_PAGE_ENDPOINTS.ROOT} class={cn(buttonVariants({ size: 'lg' }))}>
		{m['ScanPage.ScanEmpty.cta']()}
	</Link>
</Section>
