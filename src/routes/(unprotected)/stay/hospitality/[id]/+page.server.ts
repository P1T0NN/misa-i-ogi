// SVELTEKIT IMPORTS
import { redirect } from '@sveltejs/kit';

// LIBRARIES
import { api } from '@/convex/_generated/api';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

// CONFIG
import { COOKIE_NAMES } from '@/shared/config';
import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

// TYPES
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { cookies } = event;
	const { currentUser } = await event.parent();

	if ((currentUser as { role?: string } | null)?.role === 'admin') {
		return;
	}

	const guestStayCookie = cookies.get(COOKIE_NAMES.GUEST_STAY);
	if (!guestStayCookie) {
		throw redirect(302, UNPROTECTED_PAGE_ENDPOINTS.STAY);
	}

	const client = createConvexHttpClient();
	const currentGuest = await client.query(
		api.tables.guests.queries.fetchGuestSessionFromCookie.fetchGuestSessionFromCookie,
		{ guestStayCookie }
	);

	if (currentGuest.status !== 'active') {
		throw redirect(302, UNPROTECTED_PAGE_ENDPOINTS.STAY);
	}
};
