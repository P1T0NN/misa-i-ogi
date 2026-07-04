/**
 * Hospitality connect codes — the short shareable secret an owner hands out so
 * an accommodation owner can request a custom partnership by code instead of
 * browsing every venue. Pure module (no server imports) so the client form
 * schema can reuse the length + normalizer.
 */

export const CONNECT_CODE_LENGTH = 5;

// Crockford-ish alphabet: no 0/O/1/I/L so codes read cleanly over the phone.
const CONNECT_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** One random candidate code. Uniqueness is enforced by the caller via the index. */
export function generateConnectCode(): string {
	let code = '';
	for (let i = 0; i < CONNECT_CODE_LENGTH; i++) {
		code += CONNECT_CODE_ALPHABET[Math.floor(Math.random() * CONNECT_CODE_ALPHABET.length)];
	}
	return code;
}

/** Canonical form for storage + lookup: trimmed, uppercased. */
export function normalizeConnectCode(input: string): string {
	return input.trim().toUpperCase();
}
