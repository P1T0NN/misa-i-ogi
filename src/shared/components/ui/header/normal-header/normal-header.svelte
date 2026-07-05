<script lang="ts">
	// SVELTEKIT
	import { page } from '$app/state';

	// LIBRARIES
	import { scrollY } from 'svelte/reactivity/window';
	import { deLocalizeUrl } from '@/shared/lib/paraglide/runtime';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants.js';
	import {
		PROTECTED_PAGE_ENDPOINTS,
		UNPROTECTED_PAGE_ENDPOINTS
	} from '@/shared/page-endpoints.js';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';
	import { m } from '@/shared/lib/paraglide/messages';
	import {
		getNormalHeaderNavItems,
		getNormalHeaderSectionIds,
		isHeaderNavActive,
		normalHeader,
		navLinkActiveClass,
		navLinkClass
	} from './normal-header.svelte.ts';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';
	import Logo from '@/shared/components/ui/logo/logo.svelte';
	import LanguageSelector from '../../language-selector/language-selector.svelte';
	import NormalHeaderMobile from './normal-header-mobile.svelte';
	import NormalHeaderUserMenu from './normal-header-user-menu.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	type Props = {
		class?: string;
		/** Pin the bar under the viewport top while scrolling. */
		isSticky?: boolean;
		/**
		 * Use a clear bar over heroes. When `changeBgOnScroll` is true, the bar
		 * stays clear at the top of the page and picks up the solid surface after scroll.
		 */
		isTransparent?: boolean;
		/** Only used when `isTransparent` is true: solid frosted bar after leaving the top. */
		changeBgOnScroll?: boolean;
		/** Show [`Logo`](@/shared/components/ui/logo/logo.svelte); if false, use the company name link. */
		hasLogo?: boolean;
	};

	let {
		class: className,
		isSticky = true,
		isTransparent = false,
		changeBgOnScroll = false,
		hasLogo = true
	}: Props = $props();

	const user = $derived(authClass.currentUser);
	const showAccountMenu = $derived(authClass.userLoading || user !== null);

	const logoHref = $derived(
		user ? PROTECTED_PAGE_ENDPOINTS.DASHBOARD : UNPROTECTED_PAGE_ENDPOINTS.ROOT
	);

	const pathnameLogical = $derived(deLocalizeUrl(page.url).pathname);

	const scrolledPastTop = $derived((scrollY.current ?? 0) > 8);
	const useSolidBar = $derived(!isTransparent || (changeBgOnScroll && scrolledPastTop));
	const navItems = $derived(getNormalHeaderNavItems());

	// Scroll-spy: highlight the nav item whose section is currently in view. IntersectionObserver
	// (off-thread, no per-frame scroll listener) watches a thin band at the viewport's center.
	$effect(() => {
		// Re-run on route change so we observe the current page's sections — or none, off the landing.
		void pathnameLogical;

		const sections = getNormalHeaderSectionIds()
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);

		if (sections.length === 0) {
			normalHeader.activeSection = '';
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) normalHeader.activeSection = `#${entry.target.id}`;
				}
			},
			{ rootMargin: '-45% 0px -45% 0px' }
		);

		for (const section of sections) observer.observe(section);

		return () => observer.disconnect();
	});
</script>

<header
	class={cn(
		'z-50 w-full max-w-full overflow-x-clip transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out',
		isSticky ? 'sticky top-0' : 'relative',
		useSolidBar
			? 'border-b border-border bg-background/95 shadow-none backdrop-blur supports-backdrop-filter:bg-background/80'
			: 'border-b border-transparent bg-transparent shadow-none backdrop-blur-none',
		className
	)}
>
	<div class="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
		<div class="flex min-w-0 shrink items-center gap-2 lg:shrink-0">
			{#if hasLogo}
				<Logo href={logoHref} />
			{:else}
				<Link
					href={logoHref}
					class="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base"
				>
					{COMPANY_DATA.NAME}
				</Link>
			{/if}
		</div>

		<nav
			class="hidden min-w-0 flex-1 justify-center lg:flex"
			aria-label={m['Header.navAriaLabel']()}
		>
			<ul class="flex max-w-full min-w-0 flex-wrap items-center justify-center gap-1">
				{#each navItems as item (item.href)}
					{@const active = isHeaderNavActive(
						item.href,
						pathnameLogical,
						normalHeader.activeSection
					)}
					<li class="shrink-0">
						<Link
							href={item.href}
							class={cn(navLinkClass, active && navLinkActiveClass)}
							aria-current={active ? 'page' : undefined}
						>
							{item.label}
						</Link>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="ml-auto flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 lg:ml-0">
			<div class="hidden sm:block">
				{#if showAccountMenu}
					<NormalHeaderUserMenu />
				{:else}
					<div class="flex items-center gap-2">
						<Button
							href={UNPROTECTED_PAGE_ENDPOINTS.LOGIN}
							variant="secondary"
							size="sm"
							class="text-button"
						>
							{m['LoginButton.login']()}
						</Button>
						<Button
							href={UNPROTECTED_PAGE_ENDPOINTS.SIGNUP}
							size="sm"
							class="bg-primary text-button text-primary-foreground hover:bg-primary/90"
						>
							{m['Header.registerFree']()}
						</Button>
					</div>
				{/if}
			</div>

			<LanguageSelector variant="default" />

			<NormalHeaderMobile {hasLogo} />
		</div>
	</div>
</header>
