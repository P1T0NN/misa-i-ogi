<script lang="ts">
	import './layout.css';
	import favicon from '@/shared/lib/assets/favicon.svg';

	// SVELTEKIT IMPORTS
	import { page } from '$app/state';
	import { afterNavigate, goto } from '$app/navigation';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	// LIBRARIES
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '@/features/auth/lib/auth-client';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	// CLASSES
	import { authClass, type CurrentUser } from '@/features/auth/classes/authClass.svelte';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import { Toaster } from '@/shared/components/ui/sonner';
	import NormalHeader from '@/shared/components/ui/header/normal-header/normal-header.svelte';
	import Footer from '@/shared/components/ui/footer/footer.svelte';
	import AuthErrorBanner from '@/features/auth/components/auth-error-banner/auth-error-banner.svelte';

	// UTILS
	import { deLocalizeUrl, shouldRedirect } from '@/shared/lib/paraglide/runtime';

	let { children, data } = $props();

	const pathnameLogical = $derived(deLocalizeUrl(page.url).pathname);
	const isLoginPage = $derived(pathnameLogical === UNPROTECTED_PAGE_ENDPOINTS.LOGIN);
	const isAdminPage = $derived(
		pathnameLogical === '/admin' || pathnameLogical.startsWith('/admin/')
	);
	const isStayPage = $derived(pathnameLogical === '/stay' || pathnameLogical.startsWith('/stay/'));
	const isProtectedPage = $derived(
		page.route.id != null &&
			page.route.id.startsWith('/(protected)/') &&
			!page.route.id.startsWith('/(protected)/admin')
	);
	const showSiteChrome = $derived(!isLoginPage && !isAdminPage && !isProtectedPage);

	// Re-sync locale-prefixed URLs after hydration and client-side navigations.
	// SSR document requests are handled by paraglideMiddleware in hooks.server.ts.
	async function syncLocaleUrl(url: string) {
		const decision = await shouldRedirect({ url });
		if (!decision.shouldRedirect || !decision.redirectUrl) return;

		if (decision.redirectUrl.origin !== window.location.origin) {
			window.location.href = decision.redirectUrl.href;
			return;
		}

		await goto(decision.redirectUrl, { invalidateAll: true, replaceState: true, noScroll: true });
	}

	onMount(() => {
		void syncLocaleUrl(window.location.href);
	});

	afterNavigate((navigation) => {
		if (navigation.to) {
			void syncLocaleUrl(navigation.to.url.href);
		}
	});

	createSvelteAuthClient({
		authClient,
		getServerState: () => data.authState
	});
	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	// NOTE: Has to be after the `createSvelteAuthClient` call because it uses the `authClient` instance.
	const auth = useAuth();

	const currentUserResponse = useQuery(
		api.auth.queries.authQueries.getCurrentUser,
		() => (auth.isAuthenticated && !isStayPage ? {} : 'skip'),
		() => ({
			initialData: data.currentUser ?? undefined,
			keepPreviousData: true
		})
	);

	// Push the live query into the shared store so any component can read
	// `authClass.currentUser` without re-subscribing.
	$effect(() => {
		if (!auth.isAuthenticated) {
			authClass.syncFromCurrentUserQuery(null, false);
			return;
		}

		if (isStayPage) {
			authClass.syncFromCurrentUserQuery(data.currentUser ?? authClass.currentUser ?? null, false);
			return;
		}

		const currentUser = currentUserResponse.data as CurrentUser | null | undefined;
		authClass.syncFromCurrentUserQuery(currentUser, currentUserResponse.isLoading);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if dev}
		<script
			defer
			src="https://umami-sable-iota.vercel.app/script.js"
			data-website-id="b8f657d5-dddc-4c34-bdda-2da1cf55e58f"
		></script>
	{/if}
</svelte:head>

<div class="flex min-h-dvh flex-col">
	{#if showSiteChrome}
		<NormalHeader changeBgOnScroll={true} />
	{/if}
	<div class="min-h-0 flex-1">
		{@render children()}
	</div>
	{#if showSiteChrome}
		<Footer />
	{/if}
</div>
<Toaster richColors />
<AuthErrorBanner />
