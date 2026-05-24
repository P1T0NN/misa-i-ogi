// TYPES
import type { GuestCookiePayload } from '@/convex/tables/guests/types/guestsTypes';

const encoder = new TextEncoder();

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
		if (typeof parsed.sessionToken !== 'string' || typeof parsed.exp !== 'number') {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

export async function signGuestSessionValue(value: string, secret: string): Promise<string> {
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

export async function verifyGuestSessionValue(
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

/** Verifies the raw signed guest cookie value. Returns payload or `null`. */
export async function verifyGuestSessionCookieValue(
	rawCookie: string,
	secret: string
): Promise<GuestCookiePayload | null> {
	const dot = rawCookie.lastIndexOf('.');
	if (dot <= 0) return null;

	const encoded = rawCookie.slice(0, dot);
	const signature = rawCookie.slice(dot + 1);
	if (!(await verifyGuestSessionValue(encoded, signature, secret))) return null;

	return decodeGuestSessionPayload(encoded);
}

export function isGuestSessionCookieActive(
	payload: GuestCookiePayload | null,
	now = Date.now()
): boolean {
	if (!payload) return false;
	return payload.exp >= now;
}
