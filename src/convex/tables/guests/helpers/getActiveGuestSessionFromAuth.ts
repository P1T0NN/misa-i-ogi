// UTILS
import { isGuestStayIdentity } from '@/convex/tables/guests/utils/isGuestStayIdentity';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

/** Resolves an active guest row from Convex auth context, or `null`. */
export async function getActiveGuestSessionFromAuth(ctx: QueryCtx): Promise<Doc<'guests'> | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!isGuestStayIdentity(identity)) return null;

	const guest = await ctx.db.get(identity.subject);
	if (!guest) return null;
	if (guest.expiresAt < Date.now()) return null;
	if (guest.accommodationId !== identity.accommodationId) return null;

	return guest;
}
