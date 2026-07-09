// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// CONFIG
import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

// UTILS
import { deLocalizeHref } from '@/shared/lib/paraglide/runtime';
import { isNavItemActive } from '@/shared/utils/isNavItemActive.js';

export function getNormalHeaderNavItems() {
	const root = UNPROTECTED_PAGE_ENDPOINTS.ROOT;
	return [
		{ href: root, label: m['Header.linkHome']() },
		{ href: `${root}#benefits`, label: m['Header.linkBenefits']() },
		{ href: `${root}#guest-flow`, label: m['Header.linkHowItWorks']() },
		{ href: `${root}#owner-features`, label: m['Header.linkFeatures']() },
		{ href: `${root}#faq`, label: m['Header.linkFaq']() }
	];
}

/**
 * Active state for the header nav. Items are in-page anchors (e.g. `/#faq`) that all share the
 * pathname `/`, so we match on the section currently in view (driven by the header's scroll-spy).
 * Falls back to pathname matching for non-anchor items.
 */
export function isHeaderNavActive(href: string, pathname: string, activeHash: string): boolean {
	const hashIndex = href.indexOf('#');
	if (hashIndex === -1) {
		if (deLocalizeHref(href) === '/') {
			return isNavItemActive(pathname, href) && activeHash === '';
		}
		return isNavItemActive(pathname, href);
	}
	return activeHash !== '' && href.slice(hashIndex) === activeHash;
}

/** Section ids (without `#`) that the header scroll-spy observes, derived from the nav items. */
export function getNormalHeaderSectionIds(): string[] {
	return getNormalHeaderNavItems()
		.map((item) => (item.href.includes('#') ? item.href.slice(item.href.indexOf('#') + 1) : null))
		.filter((id): id is string => id !== null);
}

export const navLinkClass =
	'text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

export const navLinkActiveClass =
	'text-primary bg-primary/10 font-semibold hover:bg-primary/15 hover:text-primary';

class NormalHeader {
	menuOpen = $state(false);
	/** Hash of the section currently in view (e.g. `#faq`), updated by the header scroll-spy. */
	activeSection = $state('');

	closeMenu() {
		this.menuOpen = false;
	}
}

export const normalHeader = new NormalHeader();
