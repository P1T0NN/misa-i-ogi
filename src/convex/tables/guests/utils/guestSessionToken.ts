// LIBRARIES
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';

// UTILS
import {
	encodeGuestSessionPayload,
	isGuestSessionCookieActive,
	signGuestSessionValue,
	verifyGuestSessionCookieValue
} from '@/convex/tables/guests/utils/guestStayCookieCrypto';

// TYPES
import type { GuestCookiePayload } from '@/convex/tables/guests/types/guestsTypes';

function guestSessionSecret(): string {
	const secret = process.env.GUEST_STAY_COOKIE_SECRET?.trim();
	if (!secret) {
		throw new Error('GUEST_STAY_COOKIE_SECRET is not set in Convex environment');
	}
	return secret;
}

/** Cryptographically random opaque session token (stored in the HttpOnly cookie). */
export function generateGuestSessionToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return encodeBase64url(bytes);
}

/** One-way fingerprint of the cookie token — only this hash is stored in `guests`. */
export function hashGuestSessionToken(token: string): string {
	return encodeHexLowerCase(
		sha256(new TextEncoder().encode(`${guestSessionSecret()}:${token}`))
	);
}

/** Builds the signed HttpOnly cookie value for SvelteKit to `Set-Cookie`. */
export async function signGuestStayCookie(
	sessionToken: string,
	expiresAt: number
): Promise<string> {
	const encoded = encodeGuestSessionPayload({ sessionToken, exp: expiresAt });
	const signature = await signGuestSessionValue(encoded, guestSessionSecret());
	return `${encoded}.${signature}`;
}

/** Verifies the raw signed guest cookie. Returns payload or `null`. */
export async function verifyGuestSessionCookie(
	rawCookie: string
): Promise<GuestCookiePayload | null> {
	return verifyGuestSessionCookieValue(rawCookie, guestSessionSecret());
}

/** True when the cookie signature is valid and `exp` has not passed. */
export async function isGuestSessionCookieActiveRaw(rawCookie: string): Promise<boolean> {
	const payload = await verifyGuestSessionCookie(rawCookie);
	return isGuestSessionCookieActive(payload);
}
