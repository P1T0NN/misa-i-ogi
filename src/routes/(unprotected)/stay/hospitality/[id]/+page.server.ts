// SVELTEKIT IMPORTS
import { redirect } from '@sveltejs/kit';

// LIBRARIES
import { api } from '@/convex/_generated/api';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

// CONFIG
import { COOKIE_NAMES } from '@/shared/config';
import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { cookies, params } = event;
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

	// Track the hospitality view for analytics — fire-and-forget
	client
		.mutation(api.tables.hospitalities.mutations.viewHospitality.viewHospitality, {
			hospitalityId: params.id as Id<'hospitalities'>,
			accommodationId: currentGuest.accommodationId
		})
		.catch(() => {
			// Best-effort — don't block the page render
		});
};
