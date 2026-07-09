// HELPERS
import { getActiveGuestSession } from '@/convex/tables/guests/helpers/getActiveGuestSession';
import { guestSessionSafe } from '@/convex/tables/guests/validators/guestQueryValidators';

// UTILS
import { verifyGuestSessionCookie } from '@/convex/tables/guests/utils/guestStayCookieCrypto';

// TYPES
import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';
import type { QueryCtx } from '@/convex/_generated/server';

/** Signed HttpOnly cookie → active guest session, or a missing/expired status. */
export async function resolveGuestSessionFromCookie(
	ctx: QueryCtx,
	rawCookie: string,
	asOfMs: number
): Promise<CurrentGuest> {
	const payload = await verifyGuestSessionCookie(rawCookie);
	if (!payload) {
		return { status: 'missing', guest: null };
	}

	const guest = await getActiveGuestSession(ctx, rawCookie, asOfMs);
	if (!guest) {
		return { status: 'expired', guest: null };
	}

	return {
		status: 'active',
		guest: guestSessionSafe.project(guest)
	};
}
