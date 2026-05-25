// UTILS
import {
	hashGuestCredential,
	isValidGuestSharingCode
} from '@/convex/tables/guests/utils/guestSessionToken';
import { verifyGuestSessionCookie } from '@/convex/tables/guests/utils/guestStayCookieCrypto';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Resolves an active guest row from the signed HttpOnly cookie, or `null`. */
export async function getActiveGuestSession(
	ctx: QueryCtx | MutationCtx,
	rawCookie: string
): Promise<Doc<'guests'> | null> {
	const payload = await verifyGuestSessionCookie(rawCookie);
	if (!payload) return null;

	let guest: Doc<'guests'> | null = null;
	if (payload.sessionToken) {
		const sessionTokenHash = hashGuestCredential('sessionToken', payload.sessionToken);
		guest = await ctx.db
			.query('guests')
			.withIndex('by_session_token_hash', (q) => q.eq('sessionTokenHash', sessionTokenHash))
			.unique();
	}

	if (!guest && isValidGuestSharingCode(payload.sharingCode)) {
		const sharingCodeHash = hashGuestCredential('sharingCode', payload.sharingCode);
		guest = await ctx.db
			.query('guests')
			.withIndex('by_sharing_code_hash', (q) => q.eq('sharingCodeHash', sharingCodeHash))
			.first();
	}

	if (!guest) return null;
	if (guest.expiresAt < Date.now()) return null;

	return guest;
}
