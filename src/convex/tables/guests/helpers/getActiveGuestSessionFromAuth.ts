// UTILS
import { isGuestStayIdentity } from '@/convex/tables/guests/utils/isGuestStayIdentity';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Resolves an active guest row from Convex auth context, or `null`. */
export async function getActiveGuestSessionFromAuth(
	ctx: QueryCtx | MutationCtx
): Promise<Doc<'guests'> | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!isGuestStayIdentity(identity)) return null;

	const guest = await ctx.db.get(identity.subject);
	if (!guest) return null;
	if (guest.expiresAt < Date.now()) return null;
	if (guest.accommodationId !== identity.accommodationId) return null;

	const accommodation = await ctx.db.get(guest.accommodationId);
	if (!accommodation?.isActive) return null;

	return guest;
}
