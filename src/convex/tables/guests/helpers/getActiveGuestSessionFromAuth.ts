// UTILS
import { isGuestStayIdentity } from '@/convex/tables/guests/utils/isGuestStayIdentity';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/**
 * Resolves an active guest row from Convex auth context, or `null`.
 * Pass `asOfMs` from mutations; omit in queries so subscriptions stay cache-friendly
 * (expiry is enforced again at mutation trust boundaries).
 */
export async function getActiveGuestSessionFromAuth(
	ctx: QueryCtx | MutationCtx,
	asOfMs?: number
): Promise<Doc<'guests'> | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!isGuestStayIdentity(identity)) return null;

	const guest = await ctx.db.get(identity.subject);
	if (!guest) return null;
	if (asOfMs !== undefined && guest.expiresAt < asOfMs) return null;
	if (guest.accommodationId !== identity.accommodationId) return null;

	const accommodation = await ctx.db.get(guest.accommodationId);
	if (!accommodation?.isActive) return null;

	return guest;
}
