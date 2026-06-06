import { deLocalizeHref } from '@/shared/lib/paraglide/runtime';

/** Same-origin app path (e.g. `/sidebar`), not `#`, `javascript:`, or external URLs. */
export function isNavItemActive(
	pathname: string,
	href: string,
	options: { exact?: boolean } = {}
): boolean {
	if (!href || href === '#' || /^[a-z][a-z0-9+.-]*:/i.test(href)) return false;
	const currentPathname = deLocalizeHref(pathname);
	const targetPathname = deLocalizeHref(href);
	if (currentPathname === targetPathname) return true;
	if (options.exact) return false;
	if (targetPathname !== '/' && currentPathname.startsWith(`${targetPathname}/`)) return true;
	return false;
}
