// SVELTEKIT IMPORTS
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

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

/** Thin bridge: HttpOnly cookie -> short-lived Convex guest JWT (crypto lives in Convex). */
export const GET: RequestHandler = async ({ cookies, getClientAddress }) => {
	const guestStayCookie = cookies.get(COOKIE_NAMES.GUEST_STAY);
	if (!guestStayCookie) {
		return unauthorized('missing');
	}

	let result: CreateGuestConvexAuthTokenResult;
	try {
		const client = createConvexHttpClient();
		result = await client.action(
			api.tables.guests.actions.createGuestConvexAuthToken.createGuestConvexAuthToken,
			{
				guestStayCookie,
				ip: getClientAddress(),
				secret: env.SEARCH_INPUT_RATE_LIMIT_SECRET ?? ''
			}
		);
	} catch (err) {
		// Rate-limited or a transient Convex failure — degrade to the tolerated
		// "missing" response the client already handles, never an unhandled 500.
		console.error('[guest-auth/token] token mint failed', err);
		return unauthorized('missing');
	}

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
