// SVELTEKIT IMPORTS
import { json } from '@sveltejs/kit';

// LIBRARIES
import { api } from '@/convex/_generated/api';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

// CONFIG
import { COOKIE_NAMES } from '@/shared/config';

// TYPES
import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';
import type { FunctionReturnType } from 'convex/server';
import type { RequestHandler } from './$types';

type MintGuestConvexAuthToken =
	typeof api.tables.guests.actions.mintGuestConvexAuthToken.mintGuestConvexAuthToken;
type MintGuestConvexAuthTokenResult = FunctionReturnType<MintGuestConvexAuthToken>;

const noStoreHeaders = {
	'cache-control': 'no-store'
};

function unauthorized(status: CurrentGuest['status']) {
	return json({ status }, { status: 401, headers: noStoreHeaders });
}

// TODO(rate-limit): Add Upstash Redis rate limiting here before calling Convex.
// Key by client IP (`getClientAddress()`) and optionally a hash of `guestStayCookie`
// for per-session limits on shared WiFi.

/** Thin bridge: HttpOnly cookie -> short-lived Convex guest JWT (crypto lives in Convex). */
export const GET: RequestHandler = async ({ cookies }) => {
	const guestStayCookie = cookies.get(COOKIE_NAMES.GUEST_STAY);
	if (!guestStayCookie) {
		return unauthorized('missing');
	}

	const client = createConvexHttpClient();
	const result: MintGuestConvexAuthTokenResult = await client.action(
		api.tables.guests.actions.mintGuestConvexAuthToken.mintGuestConvexAuthToken,
		{ guestStayCookie }
	);

	if ('token' in result) {
		return json({ token: result.token }, { headers: noStoreHeaders });
	}

	return unauthorized(result.status);
};
