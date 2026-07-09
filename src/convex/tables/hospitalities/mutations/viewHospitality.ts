// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { mutation } from '@/convex/_generated/server';
import { enforceRateLimit } from '@/convex/rateLimits/enforceRateLimit';
import { rateLimitKey } from '@/convex/rateLimits/keys';

// HELPERS
import { getActiveGuestSession } from '@/convex/tables/guests/helpers/getActiveGuestSession';
import { hasActivePartnership } from '@/convex/tables/partnerships/helpers/hasActivePartnership';

export const viewHospitality = mutation({
	args: {
		hospitalityId: v.id('hospitalities'),
		guestStayCookie: v.string()
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const [hospitality, guest] = await Promise.all([
			ctx.db.get(args.hospitalityId),
			getActiveGuestSession(ctx, args.guestStayCookie, Date.now())
		]);
		if (!hospitality?.isActive) return null;
		if (!guest) return null;

		// Meter the per-guest DB fan-out below. The early-exits above are cheap
		// reads; charge only once we've confirmed a real guest session.
		await enforceRateLimit(ctx, 'viewHospitality', rateLimitKey.guest(guest._id));

		const [accommodation, isPartnered] = await Promise.all([
			ctx.db.get(guest.accommodationId),
			hasActivePartnership(ctx, guest.accommodationId, args.hospitalityId)
		]);
		// Only partnered venues are reachable from the stay page — anything else is a
		// hand-crafted call and must not inflate view counts.
		if (!accommodation?.isActive || !isPartnered) return null;

		const scopes = [
			{
				scopeType: 'organization' as const,
				scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
			},
			{
				scopeType: 'organization' as const,
				scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
			}
		];

		await analytics.track(ctx, 'hospitality.viewed', {
			actorId: guest._id,
			subject: { type: 'hospitality', id: hospitality._id },
			organizationId: hospitality.ownerId,
			scopes,
			properties: {
				hospitalityId: hospitality._id,
				hospitalityName: hospitality.name,
				accommodationId: accommodation._id,
				accommodationName: accommodation.name
			},
			unique: {
				key: `guestView:${guest._id}:${args.hospitalityId}`
			}
		});

		return null;
	}
});
