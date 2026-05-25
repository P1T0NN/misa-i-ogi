// SVELTEKIT IMPORTS
import { browser, dev } from '$app/environment';

// TYPES
import type { Cookies } from '@sveltejs/kit';

type CreateCookieOptions = {
	name: string;
	value: string;
	/** Absolute expiry as a `Date` or epoch milliseconds. */
	expires?: Date | number;
	/** Relative lifetime in seconds. Used when `expires` is omitted. */
	maxAge?: number;
} & Omit<
	NonNullable<Parameters<Cookies['set']>[2]>,
	'path' | 'httpOnly' | 'sameSite' | 'secure' | 'expires' | 'maxAge'
>;

/**
 * Set an HttpOnly app cookie with shared defaults. Server-only — no-ops in the browser.
 *
 * Defaults: `path: '/'`, `httpOnly: true`, `sameSite: 'lax'`, `secure: !dev`.
 * Pass `expires` or `maxAge` for lifetime; extra SvelteKit cookie options can override via spread.
 */
export function createCookie(
	cookies: Cookies,
	{ name, value, expires, maxAge, ...overrides }: CreateCookieOptions
): void {
	if (browser) return;

	const expiresOption =
		expires === undefined ? undefined : expires instanceof Date ? expires : new Date(expires);

	cookies.set(name, value, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		...(expiresOption ? { expires: expiresOption } : {}),
		...(maxAge !== undefined ? { maxAge } : {}),
		...overrides
	});
}

/** Remove an app cookie created by {@link createCookie}. Server-only. */
export function deleteCookie(cookies: Cookies, name: string): void {
	if (browser) return;

	cookies.delete(name, {
		path: '/'
	});
}
