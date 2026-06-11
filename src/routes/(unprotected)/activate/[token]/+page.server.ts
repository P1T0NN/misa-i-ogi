// SVELTEKIT IMPORTS
import { redirect } from '@sveltejs/kit';

// LIBRARIES
import { api } from '@/convex/_generated/api';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { isRateLimitError } from '@convex-dev/rate-limiter';

// CONFIG
import { COOKIE_NAMES, GUEST_STAY } from '@/shared/config';
import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

// UTILS
import { createCookie } from '@/shared/utils/cookieUtils';

// TYPES
import type { PageServerLoad } from './$types';

const stayAlreadyActiveHref = () => `${UNPROTECTED_PAGE_ENDPOINTS.STAY}?activation=already_active`;

export const load: PageServerLoad = async (event) => {
	const { params, cookies } = event;
	const { token } = params;
	const stayHref = UNPROTECTED_PAGE_ENDPOINTS.STAY;

	const client = createConvexHttpClient();

	try {
		const result = await client.mutation(api.tables.guests.mutations.createGuest.createGuest, {
			scanToken: token,
			ip: event.getClientAddress()
		});

		if (result.success && result.data?.signedCookie) {
			createCookie(cookies, {
				name: COOKIE_NAMES.GUEST_STAY,
				value: result.data.signedCookie,
				maxAge: GUEST_STAY.DURATION_SECONDS
			});
		} else if (result.message.key === 'GenericMessages.GUEST_ALREADY_ACTIVE') {
			redirect(303, stayAlreadyActiveHref());
		}
	} catch (err) {
		if (isRateLimitError(err)) {
			redirect(303, stayHref);
		}
		throw err;
	}

	redirect(303, stayHref);
};
