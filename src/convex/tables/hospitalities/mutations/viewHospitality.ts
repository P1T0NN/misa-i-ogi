// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { mutation } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSession } from '@/convex/tables/guests/helpers/getActiveGuestSession';

export const viewHospitality = mutation({
	args: {
		hospitalityId: v.id('hospitalities'),
		guestStayCookie: v.string()
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const [hospitality, guest] = await Promise.all([
			ctx.db.get(args.hospitalityId),
			getActiveGuestSession(ctx, args.guestStayCookie)
		]);
		if (!hospitality?.isActive) return null;
		if (!guest) return null;

		const accommodationId = guest.accommodationId;

		const accommodation = await ctx.db.get(accommodationId);
		if (!accommodation?.isActive) return null;

		const scopes = [
			{
				scopeType: 'organization' as const,
				scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
			}
		];

		const properties: Record<string, string> = {
			hospitalityId: hospitality._id,
			hospitalityName: hospitality.name
		};

		scopes.push({
			scopeType: 'organization' as const,
			scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
		});
		properties.accommodationId = accommodation._id;
		properties.accommodationName = accommodation.name;

		await analytics.writeTrack(ctx, {
			name: 'hospitality.viewed',
			actorId: guest._id,
			organizationId: hospitality.ownerId,
			scopes,
			properties,
			unique: {
				key: `guestView:${guest._id}:${args.hospitalityId}`
			}
		});

		return null;
	}
});
