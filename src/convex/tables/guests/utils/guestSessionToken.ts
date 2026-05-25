// LIBRARIES
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';

const SHARING_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const SHARING_CODE_LENGTH = 4;

export type GuestCredentialKind = 'sessionToken' | 'sharingCode';

function _guestSessionSecret(): string {
	const secret = process.env.GUEST_STAY_COOKIE_SECRET?.trim();
	if (!secret) {
		throw new Error('GUEST_STAY_COOKIE_SECRET is not set in Convex environment');
	}
	return secret;
}

/** Random session token or room-sharing code, depending on `kind`. */
export function generateGuestCredential(kind: GuestCredentialKind): string {
	if (kind === 'sessionToken') {
		const bytes = new Uint8Array(32);
		crypto.getRandomValues(bytes);
		return encodeBase64url(bytes);
	}

	let code = '';
	const unbiasedLimit =
		Math.floor(256 / SHARING_CODE_ALPHABET.length) * SHARING_CODE_ALPHABET.length;

	while (code.length < SHARING_CODE_LENGTH) {
		const bytes = new Uint8Array(SHARING_CODE_LENGTH - code.length);
		crypto.getRandomValues(bytes);

		for (const byte of bytes) {
			if (byte >= unbiasedLimit) continue;
			code += SHARING_CODE_ALPHABET[byte % SHARING_CODE_ALPHABET.length];
		}
	}

	return code;
}

/** One-way fingerprint for a session token or sharing code, depending on `kind`. */
export function hashGuestCredential(kind: GuestCredentialKind, value: string): string {
	const material =
		kind === 'sessionToken'
			? `${_guestSessionSecret()}:${value}`
			: `${_guestSessionSecret()}:sharing:${normalizeGuestSharingCode(value)}`;

	return encodeHexLowerCase(sha256(new TextEncoder().encode(material)));
}

export function normalizeGuestSharingCode(code: string): string {
	return code.replace(/[\s-]/g, '').toUpperCase();
}

export function isValidGuestSharingCode(code: string): boolean {
	const normalized = normalizeGuestSharingCode(code);
	return (
		normalized.length === SHARING_CODE_LENGTH &&
		[...normalized].every((character) => SHARING_CODE_ALPHABET.includes(character))
	);
}
