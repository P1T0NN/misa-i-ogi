// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';

// HELPERS
import { analytics } from '@/convex/analytics';
import { insertPartnership } from '@/convex/tables/partnerships/helpers/insertPartnership';
import { reactivatePartnership } from '@/convex/tables/partnerships/helpers/reactivatePartnership';
import { isPlatformHospitality } from '@/convex/tables/hospitalities/utils/isPlatformHospitality';

// VALIDATORS
import { mutationResultValidator } from '@/convex/schemas/mutationResult';

// UTILS
import { parsePartnershipBenefit } from '@/convex/tables/partnerships/utils/parsePartnershipBenefit';

// TYPES
import type { MutationResult } from '@/convex/schemas/mutationResult';

export const createPartnership = adminMutation('createPartnership')({
	args: {
		accommodationId: v.id('accommodations'),
		hospitalityIds: v.array(v.id('hospitalities')),
		benefit: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const hospitalityIds = [...new Set(args.hospitalityIds)];
		if (hospitalityIds.length === 0) {
			return { success: false, message: { key: 'GenericMessages.NO_ITEMS_PROVIDED' } };
		}

		const benefit = parsePartnershipBenefit(args.benefit);
		if (!benefit) {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' }
			};
		}

		const accommodation = await ctx.db.get(args.accommodationId);
		if (!accommodation) {
			return { success: false, message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' } };
		}

		const partnershipEvents = [];

		for (const hospitalityId of hospitalityIds) {
			const hospitality = await ctx.db.get(hospitalityId);
			if (!hospitality) {
				return { success: false, message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' } };
			}
			if (isPlatformHospitality(hospitality)) {
				return {
					success: false,
					message: { key: 'GenericMessages.PARTNERSHIP_PLATFORM_HOSPITALITY_IMPLICIT' }
				};
			}

			const existing = await ctx.db
				.query('partnerships')
				.withIndex('by_pair', (q) =>
					q.eq('accommodationId', args.accommodationId).eq('hospitalityId', hospitalityId)
				)
				.unique();
			if (existing?.isActive) {
				return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_PAIR_EXISTS' } };
			}

			if (existing) {
				await reactivatePartnership(ctx, {
					partnershipId: existing._id,
					partnership: existing,
					accommodationOwnerId: accommodation.ownerId,
					hospitalityOwnerId: hospitality.ownerId,
					benefit,
					actorId: ctx.userId
				});
				continue;
			}

			const { event } = await insertPartnership(ctx, {
				accommodation,
				hospitality,
				benefit,
				actorId: ctx.userId
			});
			partnershipEvents.push(event);
		}

		if (partnershipEvents.length === 1) {
			await analytics.track(ctx, partnershipEvents[0]);
		} else if (partnershipEvents.length > 1) {
			await analytics.track(ctx, { events: partnershipEvents });
		}

		if (hospitalityIds.length === 1) {
			return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_CREATED' } };
		}

		return {
			success: true,
			message: {
				key: 'GenericMessages.PARTNERSHIPS_CREATED',
				params: { count: hospitalityIds.length }
			}
		};
	}
});
