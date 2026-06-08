<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/components/ui/breadcrumb/breadcrumbClass.svelte.js';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants.js';

	// UTILS
	import { deLocalizeUrl } from '@/shared/lib/paraglide/runtime';

	let { title }: { title?: string } = $props();

	const pathname = $derived(deLocalizeUrl(page.url).pathname);

	const titleFromPath = $derived.by(() => {
		const segments = pathname.split('/').filter(Boolean);
		if (segments.length === 0) return 'Home';
		return segments[segments.length - 1]
			.replace(/[-_]+/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	});

	const resolvedTitle = $derived(title ?? breadcrumbLabel.current ?? titleFromPath);
	const fullTitle = $derived(`${resolvedTitle} | ${COMPANY_DATA.NAME}`);
	const description = $derived(
		`${resolvedTitle} page on ${COMPANY_DATA.NAME}. ${COMPANY_DATA.DESCRIPTION}`
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
</svelte:head>
