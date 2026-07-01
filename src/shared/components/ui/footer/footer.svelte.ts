// CONFIG
import { PROTECTED_PAGE_ENDPOINTS, UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

/** When to show a footer link relative to auth state. Omit for "always". */
type FooterLinkVisibility = 'guest' | 'user';

type FooterLink = {
	href: string;
	label: string;
	visibility?: FooterLinkVisibility;
};

type FooterLinkGroup = {
	id: string;
	heading: string;
	links: FooterLink[];
};

export function getFooterLinkGroups(): FooterLinkGroup[] {
	return [
		{
			id: 'product',
			heading: m['Footer.groupProduct'](),
			links: [
				{ href: UNPROTECTED_PAGE_ENDPOINTS.ROOT, label: m['Footer.linkOverview']() },
				{
					href: PROTECTED_PAGE_ENDPOINTS.DASHBOARD,
					label: m['Footer.linkDashboard'](),
					visibility: 'user'
				}
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
			links: [
				{ href: UNPROTECTED_PAGE_ENDPOINTS.LOGIN, label: m['Footer.linkSignIn'](), visibility: 'guest' }
			]
		}
	];
}

/** Keep links whose visibility matches the current auth state. */
export function isFooterLinkVisible(link: FooterLink, isAuthenticated: boolean): boolean {
	if (link.visibility === 'guest') return !isAuthenticated;
	if (link.visibility === 'user') return isAuthenticated;
	return true;
}

/** Inline footer links — no pill chrome; matches enterprise site footers. */
export const footerLinkClass =
	'text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
