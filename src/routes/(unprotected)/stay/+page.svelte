<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// LIBRARIES
	import { getConvexClient, useQuery } from '@mmailaender/convex-svelte';
	import { useAuth as useBetterAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { api } from '@/convex/_generated/api';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ScanError from '@/shared/components/pages/(unprotected)/scan/error/scan-error.svelte';
	import ScanLoading from '@/shared/components/pages/(unprotected)/scan/loading/scan-loading.svelte';
	import StayAccommodationData from '@/shared/components/pages/(unprotected)/scan/stay-accommodation-data/stay-accommodation-data.svelte';
	import StayExpiredAccess from '@/shared/components/pages/(unprotected)/scan/stay-expired-access/stay-expired-access.svelte';
	import StayJoinAccess from '@/shared/components/pages/(unprotected)/scan/stay-join-access/stay-join-access.svelte';

	// TYPES
	import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';
	import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';

	type GuestConvexAuthStatus = 'loading' | 'authenticated' | 'missing' | 'expired' | 'error';

	const activationBlocked = $derived(page.url.searchParams.get('activation') === 'already_active');
	const betterAuth = useBetterAuth();
	let guestAuthStatus = $state<GuestConvexAuthStatus>('loading');
	let guestAuthEstablished = $state(false);
	let sharingCode = $state('');

	onMount(() => {
		const convexClient = getConvexClient();

		convexClient.setAuth(
			async () => {
				try {
					const response = await fetch('/api/guest-auth/token', {
						credentials: 'same-origin',
						headers: { accept: 'application/json' }
					});
					const body = (await response.json().catch(() => null)) as {
						token?: unknown;
						sharingCode?: unknown;
						status?: unknown;
					} | null;

					if (response.status === 401) {
						guestAuthStatus = body?.status === 'expired' ? 'expired' : 'missing';
						guestAuthEstablished = false;
						return null;
					}

					if (!response.ok || typeof body?.token !== 'string' || typeof body?.sharingCode !== 'string') {
						guestAuthStatus = 'error';
						guestAuthEstablished = false;
						return null;
					}

					sharingCode = body.sharingCode;
					guestAuthStatus = 'authenticated';
					guestAuthEstablished = true;
					return body.token;
				} catch {
					guestAuthStatus = guestAuthEstablished ? 'error' : 'missing';
					return null;
				}
			},
			(isAuthenticated) => {
				if (isAuthenticated) {
					guestAuthStatus = 'authenticated';
					guestAuthEstablished = true;
				}
			}
		);

		return () => {
			convexClient.setAuth(({ forceRefreshToken }) =>
				betterAuth.fetchAccessToken({ forceRefreshToken })
			);
		};
	});

	const currentGuestQuery = useQuery(
		api.tables.guests.queries.fetchCurrentGuest.fetchCurrentGuest,
		() => (guestAuthStatus === 'authenticated' ? {} : 'skip'),
		() => ({ keepPreviousData: true })
	);

	const accommodationQuery = useQuery(
		api.tables.accommodations.queries.fetchAccommodationDetails.fetchAccommodationDetails,
		() => {
			if (guestAuthStatus !== 'authenticated') return 'skip';
			if (currentGuestQuery.data?.status !== 'active') return 'skip';
			return {};
		},
		() => ({ keepPreviousData: true })
	);

	const currentGuest = $derived.by((): CurrentGuest | undefined => {
		if (guestAuthStatus === 'expired') return { status: 'expired', guest: null };
		if (guestAuthStatus === 'missing') return { status: 'missing', guest: null };
		return currentGuestQuery.data as CurrentGuest | undefined;
	});
	const accommodation = $derived(
		accommodationQuery.data as AccommodationStayDetailsSafe | null | undefined
	);
	const isReconcilingGuestAuth = $derived(
		guestAuthStatus === 'authenticated' &&
			(currentGuest === undefined || currentGuest.status === 'missing')
	);
	const isLoading = $derived(
		guestAuthStatus === 'loading' ||
			isReconcilingGuestAuth ||
			currentGuest === undefined ||
			(currentGuest.status === 'active' && accommodation === undefined)
	);
	const loadError = $derived(
		guestAuthStatus === 'error' || Boolean(currentGuestQuery.error || accommodationQuery.error)
	);
	const perksUnlocked = $derived(currentGuest?.status === 'active' && accommodation != null);
</script>

<SvelteHead />

<div class="min-h-dvh bg-background text-foreground">
	{#if loadError}
		<ScanError />
	{:else if isLoading}
		<ScanLoading />
	{:else if currentGuest?.status === 'active' && accommodation === null}
		<ScanError />
	{:else if currentGuest?.status === 'active' && accommodation && sharingCode}
		<StayAccommodationData {accommodation} {sharingCode} {perksUnlocked} />
	{:else if currentGuest?.status === 'expired'}
		<StayExpiredAccess />
	{:else}
		<StayJoinAccess activeScan={activationBlocked} />
	{/if}
</div>
