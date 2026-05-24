// LIBRARIES
import { GUEST_CONVEX_AUTH } from '@/convex/auth/guestConvexAuth';

type GuestConvexPrivateJwk = {
	kty: 'EC';
	crv: 'P-256';
	x: string;
	y: string;
	d: string;
	kid?: string;
	alg?: string;
	use?: string;
};

type GuestConvexPublicJwk = Omit<GuestConvexPrivateJwk, 'd'> & {
	kid: string;
	alg: 'ES256';
	use: 'sig';
};

type GuestJwtInput = {
	guestId: string;
	accommodationId: string;
	sessionExpiresAt: number;
};

const encoder = new TextEncoder();

function requiredEnv(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) {
		throw new Error(`${name} is not set in Convex environment`);
	}
	return value;
}

function parsePrivateJwk(): GuestConvexPrivateJwk {
	const raw = requiredEnv('GUEST_CONVEX_AUTH_PRIVATE_JWK');
	const parsed = JSON.parse(raw) as Partial<GuestConvexPrivateJwk>;

	if (
		parsed.kty !== 'EC' ||
		parsed.crv !== 'P-256' ||
		typeof parsed.x !== 'string' ||
		typeof parsed.y !== 'string' ||
		typeof parsed.d !== 'string'
	) {
		throw new Error('GUEST_CONVEX_AUTH_PRIVATE_JWK must be an ES256 private JWK');
	}

	return {
		kty: 'EC',
		crv: 'P-256',
		x: parsed.x,
		y: parsed.y,
		d: parsed.d,
		kid: parsed.kid,
		alg: 'ES256',
		use: 'sig'
	};
}

async function importPrivateKey(jwk: GuestConvexPrivateJwk): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		'jwk',
		jwk,
		{ name: 'ECDSA', namedCurve: 'P-256' },
		false,
		['sign']
	);
}

function base64UrlEncode(input: string | Uint8Array): string {
	const bytes = typeof input === 'string' ? encoder.encode(input) : input;
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function jsonBase64Url(input: unknown): string {
	return base64UrlEncode(JSON.stringify(input));
}

export function getGuestConvexJwks(): { keys: GuestConvexPublicJwk[] } {
	const privateJwk = parsePrivateJwk();

	return {
		keys: [
			{
				kty: 'EC',
				crv: 'P-256',
				x: privateJwk.x,
				y: privateJwk.y,
				kid: privateJwk.kid ?? GUEST_CONVEX_AUTH.keyIdFallback,
				alg: 'ES256',
				use: 'sig'
			}
		]
	};
}

export async function createGuestConvexJwt(input: GuestJwtInput): Promise<string> {
	const siteUrl = requiredEnv('SITE_URL').replace(/\/+$/, '');
	const now = Math.floor(Date.now() / 1000);
	const sessionExp = Math.floor(input.sessionExpiresAt / 1000);
	const exp = Math.min(now + GUEST_CONVEX_AUTH.tokenTtlSeconds, sessionExp);

	if (exp <= now) {
		throw new Error('Guest session has expired');
	}

	const privateJwk = parsePrivateJwk();
	const kid = privateJwk.kid ?? GUEST_CONVEX_AUTH.keyIdFallback;
	const key = await importPrivateKey(privateJwk);

	const header = { alg: 'ES256', typ: 'JWT', kid };
	const payload = {
		iss: `${siteUrl}/api/guest-auth`,
		aud: `${siteUrl}/api/guest-auth/convex`,
		sub: input.guestId,
		iat: now,
		nbf: now - 5,
		exp,
		guestAuthKind: GUEST_CONVEX_AUTH.tokenKind,
		guestId: input.guestId,
		accommodationId: input.accommodationId
	};

	const signingInput = `${jsonBase64Url(header)}.${jsonBase64Url(payload)}`;
	const signature = await crypto.subtle.sign(
		{ name: 'ECDSA', hash: 'SHA-256' },
		key,
		encoder.encode(signingInput)
	);

	return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}
