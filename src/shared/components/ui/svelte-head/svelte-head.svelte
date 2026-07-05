<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	// CLASSES
	import { breadcrumbLabel } from '@/shared/components/ui/breadcrumb/breadcrumbClass.svelte.js';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants.js';

	// UTILS
	import {
		deLocalizeHref,
		localizeHref,
		getLocale,
		locales,
		baseLocale
	} from '@/shared/lib/paraglide/runtime';

	// Open Graph wants BCP-47-ish underscore locales (e.g. `en_US`), not our `en`/`sr` codes.
	const OG_LOCALES: Record<string, string> = {
		en: 'en_US',
		sr: 'sr_RS'
	};

	let {
		title,
		description,
		image,
		ogType = 'website',
		noindex = false
	}: {
		title?: string;
		description?: string;
		/** Site-relative or absolute social-share image. Defaults to {@link COMPANY_DATA.OG_IMAGE}. */
		image?: string;
		ogType?: 'website' | 'article';
		noindex?: boolean;
	} = $props();

	// Absolute origin for canonical / og:url / og:image. Prefer the configured public
	// origin (stable across preview deploys); fall back to the request origin.
	const origin = $derived((PUBLIC_SITE_URL || page.url.origin).replace(/\/+$/, ''));

	// Normalize to the de-localized path first so canonical/alternates are correct
	// regardless of whether the served path already carries a locale prefix.
	const basePath = $derived(deLocalizeHref(page.url.pathname));
	const currentLocale = $derived(getLocale());
	const canonical = $derived(`${origin}${localizeHref(basePath, { locale: currentLocale })}`);

	const titleFromPath = $derived.by(() => {
		const segments = basePath.split('/').filter(Boolean);
		if (segments.length === 0) return 'Home';
		return segments[segments.length - 1]
			.replace(/[-_]+/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	});

	const resolvedTitle = $derived(title ?? breadcrumbLabel.current ?? titleFromPath);
	const fullTitle = $derived(`${resolvedTitle} | ${COMPANY_DATA.NAME}`);
	const resolvedDescription = $derived(
		description ?? `${resolvedTitle} page on ${COMPANY_DATA.NAME}. ${COMPANY_DATA.DESCRIPTION}`
	);

	const isCustomImage = $derived(image !== undefined && image !== COMPANY_DATA.OG_IMAGE);
	const imagePath = $derived(image ?? COMPANY_DATA.OG_IMAGE);
	const imageUrl = $derived(/^https?:\/\//.test(imagePath) ? imagePath : `${origin}${imagePath}`);

	// hreflang alternates only make sense for indexable pages. `x-default` points at
	// the base locale so crawlers have a canonical fallback.
	const alternates = $derived(
		noindex
			? []
			: [
					...locales.map((locale) => ({
						hreflang: locale,
						href: `${origin}${localizeHref(basePath, { locale })}`
					})),
					{
						hreflang: 'x-default',
						href: `${origin}${localizeHref(basePath, { locale: baseLocale })}`
					}
				]
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={resolvedDescription} />
	<link rel="canonical" href={canonical} />

	<!-- Open Graph -->
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={COMPANY_DATA.NAME} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={resolvedDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={COMPANY_DATA.NAME} />
	{#if !isCustomImage}
		<meta property="og:image:width" content={String(COMPANY_DATA.OG_IMAGE_WIDTH)} />
		<meta property="og:image:height" content={String(COMPANY_DATA.OG_IMAGE_HEIGHT)} />
	{/if}
	<meta property="og:locale" content={OG_LOCALES[currentLocale] ?? currentLocale} />
	{#each locales.filter((locale) => locale !== currentLocale) as locale (locale)}
		<meta property="og:locale:alternate" content={OG_LOCALES[locale] ?? locale} />
	{/each}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={resolvedDescription} />
	<meta name="twitter:image" content={imageUrl} />

	{#each alternates as alt (alt.hreflang)}
		<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
	{/each}

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>
