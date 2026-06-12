// CONFIG
import { PROTECTED_PAGE_ENDPOINTS, UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

export function getFooterLinkGroups() {
	return [
		{
			id: 'product',
			heading: m['Footer.groupProduct'](),
			links: [
				{ href: UNPROTECTED_PAGE_ENDPOINTS.ROOT, label: m['Footer.linkOverview']() },
				{ href: PROTECTED_PAGE_ENDPOINTS.DASHBOARD, label: m['Footer.linkDashboard']() }
			]
		},
		{
			id: 'legal',
			heading: m['Footer.groupLegal'](),
			links: [
				{
					href: UNPROTECTED_PAGE_ENDPOINTS.TERMS_OF_SERVICE,
					label: m['Footer.linkTerms']()
				}
			]
		},
		{
			id: 'account',
			heading: m['Footer.groupAccount'](),
			links: [{ href: UNPROTECTED_PAGE_ENDPOINTS.LOGIN, label: m['Footer.linkSignIn']() }]
		}
	];
}

/** Inline footer links — no pill chrome; matches enterprise site footers. */
export const footerLinkClass =
	'text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
