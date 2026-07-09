// SVELTEKIT IMPORTS
import { redirect } from '@sveltejs/kit';

// CONFIG
import { SUBSCRIPTION_ENABLED } from '@/shared/config.js';
import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

// TYPES
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	// Self-service hospitality creation is Pro-gated — closed with the paid tier.
	if (!SUBSCRIPTION_ENABLED) {
		redirect(307, PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITIES);
	}
};
