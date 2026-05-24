// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { ConvexMutationResult } from '@/convex/types/convexTypes';

export type GuestStatus = 'active' | 'expired' | 'missing';

/** Signed HttpOnly cookie payload — raw `sessionToken` never stored in Convex. */
export type GuestCookiePayload = {
	sessionToken: string;
	exp: number;
};

/** Public-safe guest session row — no `sessionTokenHash`. */
export type GuestSessionSafe = Pick<
	Doc<'guests'>,
	'_id' | 'accommodationId' | 'expiresAt' | 'createdAt' | 'lastSeenAt'
>;

/** Resolved guest session from the signed HttpOnly cookie. */
export type CurrentGuest = {
	status: GuestStatus;
	guest: GuestSessionSafe | null;
};

export type CreateGuestResult = ConvexMutationResult<{ signedCookie: string }>;
