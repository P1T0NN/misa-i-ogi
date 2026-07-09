// SVELTEKIT IMPORTS
import { redirect } from '@sveltejs/kit';

// CONFIG
import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

// TYPES
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { locals } = event;

	// Cheap fast-path: no cookie at all → straight to login without a parent await.
	if (!locals.token) {
		throw redirect(302, UNPROTECTED_PAGE_ENDPOINTS.LOGIN);
	}

	// `locals.token` is the raw cookie and can be present but expired/invalid. The
	// root layout already resolved the session; if it came back empty the cookie is
	// stale, so redirect instead of rendering broken empty-state pages.
	const { currentUser } = await event.parent();
	if (!currentUser) {
		throw redirect(302, UNPROTECTED_PAGE_ENDPOINTS.LOGIN);
	}
};
