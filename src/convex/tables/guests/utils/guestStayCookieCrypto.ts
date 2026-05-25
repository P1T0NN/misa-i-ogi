// TYPES
import type { GuestCookiePayload } from '@/convex/tables/guests/types/guestsTypes';

const encoder = new TextEncoder();

function _guestSessionSecret(): string {
	const secret = process.env.GUEST_STAY_COOKIE_SECRET?.trim();
	if (!secret) {
		throw new Error('GUEST_STAY_COOKIE_SECRET is not set in Convex environment');
	}
	return secret;
}

export function bufferToBase64Url(bytes: Uint8Array): string {
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlToBuffer(value: string): Uint8Array<ArrayBuffer> {
	const padded = value.replace(/-/g, '+').replace(/_/g, '/');
	const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
	const binary = atob(padded + pad);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

export function encodeGuestSessionPayload(payload: GuestCookiePayload): string {
	return bufferToBase64Url(encoder.encode(JSON.stringify(payload)));
}

export function decodeGuestSessionPayload(encoded: string): GuestCookiePayload | null {
	try {
		const bytes = base64UrlToBuffer(encoded);
		const json = new TextDecoder().decode(bytes);
		const parsed = JSON.parse(json) as GuestCookiePayload;
		const hasSharingCode = typeof parsed.sharingCode === 'string' && parsed.sharingCode.length > 0;
		if (!hasSharingCode || typeof parsed.exp !== 'number') {
			return null;
		}
		if (parsed.sessionToken !== undefined && typeof parsed.sessionToken !== 'string') {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

async function _signGuestSessionValue(value: string, secret: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
	return bufferToBase64Url(new Uint8Array(signature));
}

async function _verifyGuestSessionValue(
	value: string,
	signature: string,
	secret: string
): Promise<boolean> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['verify']
	);
	try {
		const sigBytes = base64UrlToBuffer(signature);
		return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(value));
	} catch {
		return false;
	}
}

/** Verifies the raw signed guest cookie. Returns payload or `null`. */
export async function verifyGuestSessionCookie(
	rawCookie: string
): Promise<GuestCookiePayload | null> {
	const dot = rawCookie.lastIndexOf('.');
	if (dot <= 0) return null;

	const encoded = rawCookie.slice(0, dot);
	const signature = rawCookie.slice(dot + 1);
	const secret = _guestSessionSecret();
	if (!(await _verifyGuestSessionValue(encoded, signature, secret))) return null;

	return decodeGuestSessionPayload(encoded);
}

/** Builds the signed HttpOnly cookie value for SvelteKit to `Set-Cookie`. */
export async function signGuestStayCookie(options: {
	expiresAt: number;
	sharingCode: string;
	sessionToken?: string;
}): Promise<string> {
	const { expiresAt, sessionToken, sharingCode } = options;
	const encoded = encodeGuestSessionPayload({
		sharingCode,
		...(sessionToken ? { sessionToken } : {}),
		exp: expiresAt
	});
	const signature = await _signGuestSessionValue(encoded, _guestSessionSecret());
	return `${encoded}.${signature}`;
}

export function isGuestSessionCookieActive(
	payload: GuestCookiePayload | null,
	now = Date.now()
): boolean {
	if (!payload) return false;
	return payload.exp >= now;
}

/** True when the cookie signature is valid and `exp` has not passed. */
export async function isGuestSessionCookieActiveRaw(rawCookie: string): Promise<boolean> {
	const payload = await verifyGuestSessionCookie(rawCookie);
	return isGuestSessionCookieActive(payload);
}
