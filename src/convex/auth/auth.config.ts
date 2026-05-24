// LIBRARIES
import { getAuthConfigProvider } from '@convex-dev/better-auth/auth-config';
import { getGuestConvexJwks } from '@/convex/tables/guests/utils/guestConvexJwt';

// TYPES
import type { AuthConfig } from 'convex/server';

function guestAuthJwks(siteUrl: string): string {
	const hasPrivateJwk = Boolean(process.env.GUEST_CONVEX_AUTH_PRIVATE_JWK?.trim());
	if (hasPrivateJwk) {
		// Convex validates JWTs on its servers — it cannot fetch JWKS from localhost.
		// Inline the public keys (same pattern as Better Auth's getAuthConfigProvider).
		return `data:text/plain;charset=utf-8;base64,${btoa(JSON.stringify(getGuestConvexJwks()))}`;
	}

	return `${siteUrl}/api/guest-auth/jwks`;
}

function guestAuthProvider() {
	const siteUrl = process.env.SITE_URL?.trim().replace(/\/+$/, '');
	if (!siteUrl) {
		return null;
	}

	return {
		type: 'customJwt' as const,
		applicationID: `${siteUrl}/api/guest-auth/convex`,
		issuer: `${siteUrl}/api/guest-auth`,
		jwks: guestAuthJwks(siteUrl),
		algorithm: 'ES256' as const
	};
}

export default {
	providers: [getAuthConfigProvider(), guestAuthProvider()].filter(
		(provider): provider is NonNullable<typeof provider> => provider !== null
	)
} satisfies AuthConfig;
