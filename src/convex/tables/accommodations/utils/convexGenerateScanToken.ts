/** URL-safe alphabet for opaque scan tokens (no `-` or `_` — keeps QR URLs clean). */
const SCAN_TOKEN_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** Default length — ~128 bits of entropy; short enough for compact QR codes. */
const SCAN_TOKEN_LENGTH = 22;

/** Generates a cryptographically random opaque token for `/activate/[token]` QRs. */
export function convexGenerateScanToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(SCAN_TOKEN_LENGTH));
	let token = '';
	for (let i = 0; i < SCAN_TOKEN_LENGTH; i++) {
		token += SCAN_TOKEN_ALPHABET[bytes[i]! % SCAN_TOKEN_ALPHABET.length];
	}
	return token;
}
