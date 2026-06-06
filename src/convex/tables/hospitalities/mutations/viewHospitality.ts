// LIBRARIES
import { v } from 'convex/values';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// CONFIG
import { analytics } from '@/convex/analytics';
import { mutation } from '@/convex/_generated/server';

export const viewHospitality = mutation({
	args: {
		hospitalityId: v.id('hospitalities'),
		accommodationId: v.optional(v.id('accommodations'))
	},
	handler: async (ctx, args) => {
		const hospitality = await ctx.db.get(args.hospitalityId);
		if (!hospitality?.isActive) return;

		const accommodation = args.accommodationId ? await ctx.db.get(args.accommodationId) : null;
		if (args.accommodationId && !accommodation?.isActive) return;

		const scopes = [
			{
				scopeType: 'organization' as const,
				scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
			}
		];

		const properties: Record<string, string> = {
			hospitalityId: hospitality._id,
			hospitalityName: hospitality.name,
			scanType: 'hospitality-redirect'
		};

		if (accommodation) {
			scopes.push({
				scopeType: 'organization' as const,
				scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
			});
			properties.accommodationId = accommodation._id;
			properties.accommodationName = accommodation.name;
		}

		await analytics.writeTrack(ctx, {
			name: 'qr.scanned',
			organizationId: hospitality.ownerId,
			scopes,
			properties
		});
	}
});
