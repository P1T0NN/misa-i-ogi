// LIBRARIES
import { GUEST_CONVEX_AUTH } from '@/convex/auth/guestConvexAuth';

// UTILS
import { guestIssuer } from '@/convex/tables/guests/utils/guestIssuer';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { UserIdentity } from 'convex/server';

export function isGuestStayIdentity(identity: UserIdentity | null): identity is UserIdentity & {
	subject: Id<'guests'>;
	accommodationId: Id<'accommodations'>;
	guestAuthKind: typeof GUEST_CONVEX_AUTH.tokenKind;
} {
	return (
		identity !== null &&
		identity.issuer === guestIssuer() &&
		identity.guestAuthKind === GUEST_CONVEX_AUTH.tokenKind &&
		typeof identity.subject === 'string' &&
		typeof identity.accommodationId === 'string'
	);
}
