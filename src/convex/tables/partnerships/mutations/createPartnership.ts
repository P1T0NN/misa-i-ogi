// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// HELPERS
import { analytics } from '@/convex/analytics';

// VALIDATORS
import { mutationResultValidator } from '@/convex/schemas/mutationResult';

// UTILS
import {
	createAnalyticsResourceScopeId,
	createAnalyticsScopeId
} from '@piton-/analytics-convex';
import { normalizeOptionalNumber } from '@/convex/utils/convexValidationUtils';

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

		const discountPercentage = normalizeOptionalNumber(args.discountPercentage, {
			min: 1,
			max: 100
		});
		if (discountPercentage === null) {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_DISCOUNT_INVALID' }
			};
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
			const hospitality = await ctx.db.get(hospitalityId);
			if (!hospitality) {
				return { success: false, message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' } };
			}

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

			await analytics.writeTrack(ctx, {
				name: 'partnership.created',
				organizationId: accommodation.ownerId,
				scopes: [
					{ scopeType: 'organization', scopeId: hospitality.ownerId },
					{
						scopeType: 'organization',
						scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
					},
					{
						scopeType: 'organization',
						scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
					},
					{
						scopeType: 'resource',
						scopeId: createAnalyticsResourceScopeId('hospitality', hospitality._id)
					}
				],
				properties: {
					accommodationId: accommodation._id,
					accommodationName: accommodation.name,
					hospitalityId: hospitality._id,
					hospitalityName: hospitality.name,
					...(discountPercentage === undefined ? {} : { discountPercent: discountPercentage }),
					partnershipDelta: 1
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
