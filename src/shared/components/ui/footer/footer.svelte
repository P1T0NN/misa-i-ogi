<script lang="ts">
	// CONFIG
	import {
		COMPANY_DATA,
		PROTECTED_PAGE_ENDPOINTS,
		UNPROTECTED_PAGE_ENDPOINTS
	} from '@/shared/constants.js';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';
	import { footerLinkClass, getFooterLinkGroups, isFooterLinkVisible } from './footer.svelte.ts';

	// COMPONENTS
	import LanguageSelector from '@/shared/components/ui/language-selector/language-selector.svelte';
	import Link from '@/shared/components/ui/link/link.svelte';
	import Logo from '@/shared/components/ui/logo/logo.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// LUCIDE ICONS
	import MailIcon from '@lucide/svelte/icons/mail';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	type Props = {
		class?: string;
		/** Show [`Logo`](@/shared/components/ui/logo/logo.svelte); if false, use the company name link. */
		hasLogo?: boolean;
		/** Render [`getFooterLinkGroups`](./footer.svelte.ts). */
		showNav?: boolean;
	};

	let { class: className, hasLogo = true, showNav = true }: Props = $props();

	const year = new Date().getFullYear();

	const user = $derived(authClass.currentUser);
	const homeHref = $derived(
		user ? PROTECTED_PAGE_ENDPOINTS.DASHBOARD : UNPROTECTED_PAGE_ENDPOINTS.ROOT
	);

	const navLinks = $derived(
		getFooterLinkGroups()
			.flatMap((group) => group.links)
			.filter((link) => isFooterLinkVisible(link, Boolean(user)))
	);
</script>

<footer
	class={cn(
		'w-full max-w-full overflow-x-clip border-t border-border bg-muted text-foreground',
		className
	)}
>
	<div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
		<div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
			<div class="min-w-0 max-w-md">
				{#if hasLogo}
					<Logo size="md" href={homeHref} />
				{:else}
					<Link href={homeHref} class="text-base font-semibold tracking-tight text-foreground">
						{COMPANY_DATA.NAME}
					</Link>
				{/if}

				<p class="mt-4 text-sm leading-relaxed text-muted-foreground">
					{m['Footer.tagline']()}
				</p>
			</div>

			<div class="flex flex-col gap-3 text-sm lg:items-end lg:text-right">
				<a
					href={`mailto:${COMPANY_DATA.EMAIL}`}
					rel="external"
					class="inline-flex w-fit items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<MailIcon class="size-4 shrink-0 text-primary" aria-hidden="true" />
					{COMPANY_DATA.EMAIL}
				</a>

				<p class="mb-0 inline-flex items-center gap-2 text-muted-foreground">
					<MapPinIcon class="size-4 shrink-0 text-primary" aria-hidden="true" />
					{COMPANY_DATA.LOCATION}
				</p>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between"
		>
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
				{#if showNav}
					<nav aria-label={m['Footer.navLabel']()} class="flex flex-wrap gap-x-6 gap-y-2">
						{#each navLinks as item (item.href)}
							<Link href={item.href} class={footerLinkClass}>
								{item.label}
							</Link>
						{/each}
					</nav>
				{/if}

				<LanguageSelector />
			</div>

			<p class="text-xs text-muted-foreground">
				© {year}
				{COMPANY_DATA.NAME}. {m['Footer.copyright']()}
			</p>
		</div>
	</div>
</footer>
