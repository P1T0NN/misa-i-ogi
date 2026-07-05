<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// LIBRARIES
	import { useQuery } from '@mmailaender/convex-svelte';
	import { useAuth as useBetterAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { api } from '@/convex/_generated/api';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import StayError from '@/shared/components/pages/(unprotected)/stay/error/stay-error.svelte';
	import StayLoading from '@/shared/components/pages/(unprotected)/stay/loading/stay-loading.svelte';
	import StayExpiredAccess from '@/shared/components/pages/(unprotected)/stay/stay-expired-access/stay-expired-access.svelte';
	import StayJoinAccess from '@/shared/components/pages/(unprotected)/stay/stay-join-access/stay-join-access.svelte';

	// ROUTE CONTEXT
	import { setStayRouteContext } from './stayContext.svelte.js';

	// FEATURES
	import { createGuestAuth } from '@/features/guests/classes/guestAuth.svelte.js';

	// UTILS
	import { loadingTimeout } from '@/utils/loadingTimeout.svelte.js';

	// TYPES
	import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';

	let { children } = $props();

	const activationBlocked = $derived(page.url.searchParams.get('activation') === 'already_active');
	const betterAuth = useBetterAuth();

	const guestAuth = createGuestAuth(({ forceRefreshToken }) =>
		betterAuth.fetchAccessToken({ forceRefreshToken })
	);

	onMount(() => guestAuth.attach());

	const currentGuestQuery = useQuery(
		api.tables.guests.queries.fetchCurrentGuest.fetchCurrentGuest,
		() => (guestAuth.status === 'authenticated' ? {} : 'skip'),
		() => ({ keepPreviousData: true })
	);

	const currentGuest = $derived.by((): CurrentGuest | undefined => {
		if (guestAuth.status === 'expired') return { status: 'expired', guest: null };
		if (guestAuth.status === 'missing') return { status: 'missing', guest: null };
		return currentGuestQuery.data as CurrentGuest | undefined;
	});
	const isReconcilingGuestAuth = $derived(
		guestAuth.status === 'authenticated' &&
			(currentGuest === undefined || currentGuest.status === 'missing')
	);
	const isLoading = $derived(
		guestAuth.status === 'loading' || isReconcilingGuestAuth || currentGuest === undefined
	);
	// Backstop: a query stuck waiting on auth looks identical to loading — cap
	// the skeleton so it degrades to the error view (self-heals if data arrives).
	const loadTimeout = loadingTimeout(() => isLoading);
	const loadError = $derived(
		guestAuth.status === 'error' || Boolean(currentGuestQuery.error) || loadTimeout.timedOut
	);

	setStayRouteContext({
		get guestAuthStatus() {
			return guestAuth.status;
		},
		get currentGuest() {
			return currentGuest;
		},
		get sharingCode() {
			return guestAuth.sharingCode;
		}
	});
</script>

<SvelteHead />

<div class="min-h-dvh bg-background text-foreground">
	{#if loadError}
		<StayError />
	{:else if isLoading}
		<StayLoading />
	{:else if currentGuest?.status === 'active' && guestAuth.sharingCode}
		{@render children()}
	{:else if currentGuest?.status === 'expired'}
		<StayExpiredAccess />
	{:else}
		<StayJoinAccess activeScan={activationBlocked} />
	{/if}
</div>
