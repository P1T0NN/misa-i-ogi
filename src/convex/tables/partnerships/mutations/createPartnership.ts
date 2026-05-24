// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// VALIDATORS
import { mutationResultValidator } from '@/convex/schemas/mutationResult';

// TYPES
import type { MutationResult } from '@/convex/schemas/mutationResult';

export const createPartnership = adminMutation('createPartnership')({
	args: {
		accommodationId: v.id('accommodations'),
		hospitalityIds: v.array(v.id('hospitalities')),
		discountPercentage: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const hospitalityIds = [...new Set(args.hospitalityIds)];

		if (hospitalityIds.length === 0) {
			return { success: false, message: { key: 'GenericMessages.NO_ITEMS_PROVIDED' } };
		}

		const accommodation = await ctx.db.get(args.accommodationId);
		if (!accommodation) {
			return { success: false, message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' } };
		}

		const rawDiscount = args.discountPercentage?.trim();
		let discountPercentage: number | undefined;
		if (rawDiscount) {
			const n = Number(rawDiscount);
			if (Number.isNaN(n) || n < 1 || n > 100) {
				return {
					success: false,
					message: { key: 'GenericMessages.PARTNERSHIP_DISCOUNT_INVALID' }
				};
			}
			discountPercentage = n;
		}

		for (const hospitalityId of hospitalityIds) {
			const hospitality = await ctx.db.get(hospitalityId);
			if (!hospitality) {
				return { success: false, message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' } };
			}

			const existing = await ctx.db
				.query('partnerships')
				.withIndex('by_pair', (q) =>
					q.eq('accommodationId', args.accommodationId).eq('hospitalityId', hospitalityId)
				)
				.unique();

			if (existing) {
				return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_PAIR_EXISTS' } };
			}
		}

		for (const hospitalityId of hospitalityIds) {
			const partnershipId = await ctx.db.insert('partnerships', {
				accommodationId: args.accommodationId,
				accommodationScanToken: accommodation.scanToken,
				hospitalityId,
				discountPercentage,
				isActive: true
			});

			ctx.audit(AUDIT_ACTIONS.PARTNERSHIP_CREATE, {
				resource: { table: 'partnerships', id: partnershipId },
				after: {
					accommodationId: args.accommodationId,
					accommodationScanToken: accommodation.scanToken,
					hospitalityId,
					discountPercentage,
					isActive: true
				}
			});
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
