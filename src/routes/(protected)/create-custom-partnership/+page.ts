// SVELTEKIT IMPORTS
import { redirect } from '@sveltejs/kit';

// CONFIG
import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';
import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

// TYPES
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	if (!CUSTOM_PARTNERSHIP_ENABLED) {
		redirect(307, PROTECTED_PAGE_ENDPOINTS.PARTNERSHIPS);
	}
};
