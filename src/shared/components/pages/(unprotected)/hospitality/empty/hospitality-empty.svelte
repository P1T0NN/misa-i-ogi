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
	import Building2Icon from '@lucide/svelte/icons/building-2';

	type HospitalityEmptyReason = 'notFound' | 'notPartnered';

	let { reason = 'notFound' }: { reason?: HospitalityEmptyReason } = $props();

	const title = $derived.by(() => {
		if (reason === 'notPartnered') return m['HospitalityPage.HospitalityEmpty.notPartneredTitle']();
		return m['HospitalityPage.HospitalityEmpty.title']();
	});
	const body = $derived.by(() => {
		if (reason === 'notPartnered') return m['HospitalityPage.HospitalityEmpty.notPartneredBody']();
		return m['HospitalityPage.HospitalityEmpty.body']();
	});
</script>

<Section yPadding="xl" containerClass="flex flex-col items-center gap-4 text-center">
	<Building2Icon class="size-12 text-muted-foreground" aria-hidden="true" />

	<h1 class="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
		{title}
	</h1>

	<p class="max-w-md text-muted-foreground">{body}</p>

	<Link href={UNPROTECTED_PAGE_ENDPOINTS.ROOT} class={cn(buttonVariants({ size: 'lg' }))}>
		{m['HospitalityPage.HospitalityEmpty.cta']()}
	</Link>
</Section>
