// SVELTEKIT IMPORTS
import { json } from '@sveltejs/kit';

// LIBRARIES
import { api } from '@/convex/_generated/api';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

// CONFIG
import { COOKIE_NAMES } from '@/shared/config';

// UTILS
import { createCookie, deleteCookie } from '@/shared/utils/cookieUtils';

// TYPES
import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';
import type { FunctionReturnType } from 'convex/server';
import type { RequestHandler } from './$types';

type CreateGuestConvexAuthToken =
	typeof api.tables.guests.actions.createGuestConvexAuthToken.createGuestConvexAuthToken;
type CreateGuestConvexAuthTokenResult = FunctionReturnType<CreateGuestConvexAuthToken>;

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
	const result: CreateGuestConvexAuthTokenResult = await client.action(
		api.tables.guests.actions.createGuestConvexAuthToken.createGuestConvexAuthToken,
		{ guestStayCookie }
	);

	if ('token' in result) {
		if (!result.sharingCode) {
			return unauthorized('missing');
		}

		if (result.signedCookie && result.expiresAt) {
			createCookie(cookies, {
				name: COOKIE_NAMES.GUEST_STAY,
				value: result.signedCookie,
				expires: result.expiresAt
			});
		}

		return json(
			{ token: result.token, sharingCode: result.sharingCode },
			{ headers: noStoreHeaders }
		);
	}

	if (result.status === 'expired') {
		deleteCookie(cookies, COOKIE_NAMES.GUEST_STAY);
	}

	return unauthorized(result.status);
};
