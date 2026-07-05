// LIBRARIES
import { getConvexClient } from '@mmailaender/convex-svelte';

// TYPES
import type { GuestStatus } from '@/convex/tables/guests/types/guestsTypes';

export type GuestAuthStatus = Exclude<GuestStatus, 'active'> | 'loading' | 'authenticated' | 'error';

type FetchAccessToken = (args: { forceRefreshToken: boolean }) => Promise<string | null>;

/**
 * Guest-stay auth for the Convex client: swaps the client's auth over to the
 * short-lived guest JWT minted from the HttpOnly stay cookie, and exposes the
 * resulting status/sharing code as reactive state.
 *
 * Call `attach()` from `onMount` and return its cleanup — it restores the
 * regular Better Auth token when the guest leaves `/stay`.
 */
export function createGuestAuth(fallbackFetchAccessToken: FetchAccessToken) {
	let status = $state<GuestAuthStatus>('loading');
	let established = $state(false);
	let sharingCode = $state('');

	async function fetchGuestToken(): Promise<string | null> {
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
				status = body?.status === 'expired' ? 'expired' : 'missing';
				established = false;
				return null;
			}

			if (!response.ok || typeof body?.token !== 'string' || typeof body?.sharingCode !== 'string') {
				status = 'error';
				established = false;
				return null;
			}

			sharingCode = body.sharingCode;
			status = 'authenticated';
			established = true;
			return body.token;
		} catch {
			status = established ? 'error' : 'missing';
			return null;
		}
	}

	function attach() {
		const convexClient = getConvexClient();

		const apply = () => {
			convexClient.setAuth(fetchGuestToken, (isAuthenticated) => {
				if (isAuthenticated) {
					status = 'authenticated';
					established = true;
				}
			});
		};

		apply();

		// Re-assert guest auth outside onMount's reach: a bfcache restore
		// (back/forward) skips onMount, and a token fetch that failed once (tab
		// asleep, network blip) clears the client's auth for good — either way
		// every guest query stays paused forever (infinite skeletons).
		const onPageshow = (event: PageTransitionEvent) => {
			if (event.persisted) apply();
		};
		const onVisibilityChange = () => {
			if (document.visibilityState === 'visible') apply();
		};
		window.addEventListener('pageshow', onPageshow);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			window.removeEventListener('pageshow', onPageshow);
			document.removeEventListener('visibilitychange', onVisibilityChange);
			convexClient.setAuth(fallbackFetchAccessToken);
		};
	}

	return {
		get status() {
			return status;
		},
		get sharingCode() {
			return sharingCode;
		},
		attach
	};
}
