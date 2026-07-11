// LIBRARIES
import { getConvexClient } from '@mmailaender/convex-svelte';

// TYPES
import type { GuestStatus } from '@/convex/tables/guests/types/guestsTypes';

export type GuestAuthStatus =
	| Exclude<GuestStatus, 'active'>
	| 'loading'
	| 'authenticated'
	| 'error';

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

			if (
				!response.ok ||
				typeof body?.token !== 'string' ||
				typeof body?.sharingCode !== 'string'
			) {
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

		// Guest auth must own the Convex client while /stay is mounted. The root
		// Better Auth integration re-runs `client.setAuth` whenever its session
		// atom refreshes (tab refocus, cross-tab broadcast, polling), which would
		// silently swap the client back to the logged-in user's identity mid-stay
		// — every guest query then loses its session (skeletons, then the layout
		// error). Shadow `setAuth` with a no-op so competing callers are ignored;
		// the shadow is removed on cleanup.
		const setAuth = convexClient.setAuth.bind(convexClient);
		convexClient.setAuth = () => {};

		let retryTimer: ReturnType<typeof setTimeout> | undefined;
		let retryAttempt = 0;

		const apply = () => {
			clearTimeout(retryTimer);
			setAuth(fetchGuestToken, (isAuthenticated) => {
				if (isAuthenticated) {
					status = 'authenticated';
					established = true;
					retryAttempt = 0;
					return;
				}

				// The Convex client treats one failed token refresh as terminal: it
				// clears auth and never retries, leaving every guest query paused
				// (infinite skeletons) until a tab switch re-applies auth. A definitive
				// 401 sets status to 'missing'/'expired' (real end of session — don't
				// retry); anything else is transient, so re-apply with backoff.
				if (status === 'authenticated' || status === 'error') {
					const delay = Math.min(30_000, 1_000 * 2 ** retryAttempt++);
					retryTimer = setTimeout(apply, delay);
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
			clearTimeout(retryTimer);
			window.removeEventListener('pageshow', onPageshow);
			document.removeEventListener('visibilitychange', onVisibilityChange);
			// Remove the shadow (restores the prototype method), then hand the
			// client back to the regular Better Auth token.
			delete (convexClient as { setAuth?: unknown }).setAuth;
			setAuth(fallbackFetchAccessToken);
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
