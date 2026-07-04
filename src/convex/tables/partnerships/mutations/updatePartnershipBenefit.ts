// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';

// UTILS
import { parsePartnershipBenefit } from '@/convex/tables/partnerships/utils/parsePartnershipBenefit';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/** Hospitality owner sets the guest-facing offer on an active partnership. */
export const updatePartnershipBenefit = authMutation('updatePartnershipBenefit')({
	args: {
		partnershipId: v.id('partnerships'),
		benefit: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const benefit = parsePartnershipBenefit(args.benefit);
		if (!benefit) {
			return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' } };
		}

		const partnership = await ctx.db.get(args.partnershipId);
		if (!partnership?.isActive) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		const hospitality = await ctx.db.get(partnership.hospitalityId);
		if (!hospitality || hospitality.ownerId !== ctx.userId) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		await ctx.db.patch(partnership._id, { benefit });

		return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_UPDATED' } };
	}
});
