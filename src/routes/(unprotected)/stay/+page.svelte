<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// LIBRARIES
	import { getConvexClient, useQuery } from '@mmailaender/convex-svelte';
	import { useAuth as useBetterAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ScanError from '@/shared/components/pages/(unprotected)/scan/error/scan-error.svelte';
	import ScanLoading from '@/shared/components/pages/(unprotected)/scan/loading/scan-loading.svelte';
	import ScanPartnershipsSection from '@/shared/components/pages/(unprotected)/scan/scan-partnerships-section/scan-partnerships-section.svelte';
	import ScanSessionExpired from '@/shared/components/pages/(unprotected)/scan/scan-session-expired.svelte';
	import ScanAlreadyActive from '@/shared/components/pages/(unprotected)/scan/scan-already-active.svelte';
	import ScanUnlockRequired from '@/shared/components/pages/(unprotected)/scan/scan-unlock-required.svelte';

	// DATA
	import { labelAccommodationType } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type { AccommodationStayDetailsSafe } from '@/convex/tables/accommodations/types/accommodationsTypes';
	import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';

	// LUCIDE ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	type GuestConvexAuthStatus = 'loading' | 'authenticated' | 'missing' | 'expired' | 'error';

	const activationBlocked = $derived(page.url.searchParams.get('activation') === 'already_active');
	const betterAuth = useBetterAuth();
	let guestAuthStatus = $state<GuestConvexAuthStatus>('loading');

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
						status?: unknown;
					} | null;

					if (response.status === 401) {
						guestAuthStatus = body?.status === 'expired' ? 'expired' : 'missing';
						return null;
					}

					if (!response.ok || typeof body?.token !== 'string') {
						guestAuthStatus = 'error';
						return null;
					}

					return body.token;
				} catch {
					guestAuthStatus = 'error';
					return null;
				}
			},
			(isAuthenticated) => {
				if (isAuthenticated) {
					guestAuthStatus = 'authenticated';
				} else if (guestAuthStatus === 'loading') {
					guestAuthStatus = 'missing';
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
		() => (guestAuthStatus === 'authenticated' ? {} : 'skip')
	);

	const accommodationQuery = useQuery(
		api.tables.accommodations.queries.fetchAccommodationDetails.fetchAccommodationDetails,
		() => {
			if (guestAuthStatus !== 'authenticated') return 'skip';
			if (currentGuestQuery.data?.status !== 'active') return 'skip';
			return {};
		}
	);

	const currentGuest = $derived.by((): CurrentGuest | undefined => {
		if (guestAuthStatus === 'expired') return { status: 'expired', guest: null };
		if (guestAuthStatus === 'missing') return { status: 'missing', guest: null };
		return currentGuestQuery.data as CurrentGuest | undefined;
	});
	const accommodation = $derived(
		accommodationQuery.data as AccommodationStayDetailsSafe | null | undefined
	);
	const isLoading = $derived(
		guestAuthStatus === 'loading' ||
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
	{:else if currentGuest?.status === 'active' && accommodation}
		<div class="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
			{#if activationBlocked}
				<ScanAlreadyActive variant="reminder" />
			{/if}

			<div class="relative aspect-2/1 w-full overflow-hidden rounded-2xl bg-muted">
				<img
					src={accommodation.coverImageUrl}
					alt=""
					class="absolute inset-0 size-full object-cover"
					decoding="async"
					fetchpriority="high"
				/>
			</div>

			<header class="flex flex-col gap-2">
				<p class="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
					{m['ScanPage.eyebrow']()} · {labelAccommodationType(accommodation.type)}
				</p>

				<h1
					class="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl"
				>
					{accommodation.name}
				</h1>

				<p class="mt-1 text-base text-muted-foreground sm:text-lg">
					{m['ScanPage.perksTitle']({ city: accommodation.city })}
				</p>

				<p class="max-w-prose text-sm leading-relaxed text-muted-foreground">
					{m['ScanPage.perksLead']()}
				</p>
			</header>

			{#if accommodation.description}
				<p class="max-w-prose text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
					{accommodation.description}
				</p>
			{/if}

			<ScanPartnershipsSection city={accommodation.city} enabled={perksUnlocked} />

			<footer class="mt-4 border-t border-border/60 pt-6">
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
					{m['ScanPage.addressFooterEyebrow']()}
				</p>

				<p class="mt-1 flex items-start gap-2 text-sm">
					<MapPinIcon class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

					<span>{accommodation.address}, {accommodation.city}, {accommodation.country}</span>
				</p>
			</footer>
		</div>
	{:else if currentGuest?.status === 'expired'}
		<div class="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
			<header class="flex flex-col gap-3">
				<h1
					class="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl"
				>
					{m['ScanPage.eyebrow']()}
				</h1>
				<ScanSessionExpired />
			</header>
		</div>
	{:else}
		<div class="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
			<header class="flex flex-col gap-3">
				<h1
					class="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl"
				>
					{m['ScanPage.eyebrow']()}
				</h1>
				{#if activationBlocked}
					<ScanAlreadyActive />
				{:else}
					<ScanUnlockRequired />
				{/if}
			</header>
		</div>
	{/if}
</div>
