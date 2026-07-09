// TYPES
import type { ProjectionType } from '@/convex/helpers/createProjection';
import type { ConvexMutationResult } from '@/convex/types/convexTypes';
import type { guestSessionSafe } from '@/convex/tables/guests/validators/guestQueryValidators';

export type GuestStatus = 'active' | 'expired' | 'missing';

/** Signed HttpOnly cookie payload — raw `sessionToken` never stored in Convex. */
export type GuestCookiePayload = {
	/** Primary QR activation grant; raw value is never stored in Convex. */
	sessionToken?: string;
	/** Sharing grant and display code; only its hash is stored in Convex. */
	sharingCode: string;
	exp: number;
};

/** Public-safe guest session row — field list lives on `guestSessionSafe`. */
export type GuestSessionSafe = ProjectionType<typeof guestSessionSafe>;

/** Resolved guest session from the signed HttpOnly cookie. */
export type CurrentGuest = {
	status: GuestStatus;
	guest: GuestSessionSafe | null;
};

export type CreateGuestResult = ConvexMutationResult<{ signedCookie: string }>;
export type JoinGuestBySharingCodeResult = ConvexMutationResult<{
	signedCookie: string;
	expiresAt: number;
}>;
