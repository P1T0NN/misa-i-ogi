// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// HELPERS
import { analytics } from '@/convex/analytics';

// VALIDATORS
import { mutationResultValidator } from '@/convex/schemas/mutationResult';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
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
		const benefit = parsePartnershipBenefit(args.benefit);

		if (hospitalityIds.length === 0) {
			return { success: false, message: { key: 'GenericMessages.NO_ITEMS_PROVIDED' } };
		}

		const accommodation = await ctx.db.get(args.accommodationId);
		if (!accommodation) {
			return { success: false, message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' } };
		}

		if (!benefit) {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' }
			};
		}

		const hospitalities = [];

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

			hospitalities.push(hospitality);
		}

		const partnershipEvents = [];

		for (const hospitality of hospitalities) {
			const hospitalityId = hospitality._id;

			const partnershipId = await ctx.db.insert('partnerships', {
				accommodationId: args.accommodationId,
				accommodationScanToken: accommodation.scanToken,
				hospitalityId,
				benefit,
				isActive: true
			});

			ctx.audit(AUDIT_ACTIONS.PARTNERSHIP_CREATE, {
				resource: { table: 'partnerships', id: partnershipId },
				after: {
					accommodationId: args.accommodationId,
					accommodationScanToken: accommodation.scanToken,
					hospitalityId,
					benefit,
					isActive: true
				}
			});

			partnershipEvents.push({
				name: 'partnership.created' as const,
				subject: { type: 'hospitality', id: hospitality._id },
				organizationId: accommodation.ownerId,
				scopes: [
					{ scopeType: 'organization' as const, scopeId: hospitality.ownerId },
					{
						scopeType: 'organization' as const,
						scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
					},
					{
						scopeType: 'organization' as const,
						scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
					}
				],
				properties: {
					accommodationId: accommodation._id,
					accommodationName: accommodation.name,
					hospitalityId: hospitality._id,
					hospitalityName: hospitality.name,
					benefit,
					partnershipDelta: 1
				}
			});
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
