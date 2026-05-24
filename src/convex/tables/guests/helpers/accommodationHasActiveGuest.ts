// HELPERS
import { getGuestSessionsByAccommodationId } from '@/convex/tables/guests/helpers/getGuestSessionsByAccommodationId';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

/** True when the accommodation still has at least one unexpired guest session row. */
export async function accommodationHasActiveGuest(
	ctx: QueryCtx,
	accommodationId: Id<'accommodations'>,
	asOfMs: number = Date.now()
): Promise<boolean> {
	const sessions = await getGuestSessionsByAccommodationId(ctx, accommodationId);
	return sessions.some((session) => session.expiresAt >= asOfMs);
}
