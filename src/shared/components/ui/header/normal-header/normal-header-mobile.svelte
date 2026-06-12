<script lang="ts">
	// SVELTEKIT
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants.js';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';
	import { m } from '@/shared/lib/paraglide/messages';
	import {
		getNormalHeaderNavItems,
		normalHeader,
		navLinkActiveClass,
		navLinkClass
	} from './normal-header.svelte.ts';

	// COMPONENTS
	import { buttonVariants } from '@/shared/components/ui/button/button.svelte';
	import Button from '@/shared/components/ui/button/button.svelte';
	import Link from '@/shared/components/ui/link/link.svelte';
	import Logo from '@/shared/components/ui/logo/logo.svelte';
	import LanguageSelector from '@/shared/components/ui/language-selector/language-selector.svelte';
	import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/shared/components/ui/drawer';
	import { Separator } from '@/shared/components/ui/separator';
	import LoginButton from '@/features/auth/components/login-button/login-button.svelte';
	import NormalHeaderUserMenu from './normal-header-user-menu.svelte';

	// UTILS
	import { deLocalizeUrl } from '@/shared/lib/paraglide/runtime';
	import { cn } from '@/shared/utils/utils.js';
	import { isNavItemActive } from '@/shared/utils/isNavItemActive.js';

	// TYPES
	import type { ClassValue } from 'clsx';

	// LUCIDE ICONS
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';

	let { hasLogo = true }: { hasLogo?: boolean } = $props();

	const user = $derived(authClass.currentUser);
	const showAccountMenu = $derived(authClass.userLoading || user !== null);

	const pathnameLogical = $derived(deLocalizeUrl(page.url).pathname);
	const navItems = $derived(getNormalHeaderNavItems());

	afterNavigate(() => {
		normalHeader.closeMenu();
	});
</script>

<Drawer
	bind:open={normalHeader.menuOpen}
	direction="right"
	shouldScaleBackground={false}
	onOpenChange={(open) => {
		if (open) {
			requestAnimationFrame(() => {
				document.getElementById('site-mobile-nav-first')?.focus();
			});
		}
	}}
>
	<DrawerTrigger>
		{#snippet child({ props })}
			<button
				{...props}
				type="button"
				class={cn(
					buttonVariants({ variant: 'ghost', size: 'icon' }),
					'touch-manipulation lg:hidden',
					props.class as ClassValue
				)}
				aria-controls="site-mobile-nav"
				aria-label={normalHeader.menuOpen
					? m['Header.closeMenuAriaLabel']()
					: m['Header.openMenuAriaLabel']()}
			>
				{#if normalHeader.menuOpen}
					<XIcon class="size-5" />
				{:else}
					<MenuIcon class="size-5" />
				{/if}
			</button>
		{/snippet}
	</DrawerTrigger>

	<DrawerContent
		id="site-mobile-nav"
		aria-describedby={undefined}
		class="flex h-full max-h-dvh w-full max-w-80 flex-col gap-4 overflow-x-hidden overflow-y-auto border-border bg-background p-4 shadow-lg! data-[vaul-drawer-direction=right]:w-full sm:max-w-80"
	>
		<div class="flex min-w-0 items-center justify-between gap-2">
			<div class="min-w-0">
				{#if hasLogo}
					<Logo size="sm" onclick={normalHeader.closeMenu} />
				{:else}
					<span class="truncate text-sm font-semibold">{COMPANY_DATA.NAME}</span>
				{/if}
			</div>

			<DrawerClose>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					class="shrink-0 touch-manipulation"
					aria-label={m['Header.closeMenuAriaLabel']()}
				>
					<XIcon class="size-5" />
				</Button>
			</DrawerClose>
		</div>

		<nav aria-label={m['Header.mobileNavAriaLabel']()}>
			<ul class="flex flex-col gap-1">
				{#each navItems as item, i (item.href)}
					{@const active = isNavItemActive(pathnameLogical, item.href)}
					<li>
						<Link
							id={i === 0 ? 'site-mobile-nav-first' : undefined}
							href={item.href}
							class={cn(navLinkClass, 'block w-full', active && navLinkActiveClass)}
							aria-current={active ? 'page' : undefined}
							onclick={normalHeader.closeMenu}
						>
							{item.label}
						</Link>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="mt-auto flex flex-col gap-3">
			<div class="self-start">
				<LanguageSelector variant="default" />
			</div>

			<Separator />

			<div class="sm:hidden">
				{#if showAccountMenu}
					<NormalHeaderUserMenu side="top" />
				{:else}
					<LoginButton />
				{/if}
			</div>
		</div>
	</DrawerContent>
</Drawer>
