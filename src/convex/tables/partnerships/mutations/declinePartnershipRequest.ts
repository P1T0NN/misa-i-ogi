// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// CONFIG
import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';

// HELPERS
import { analytics } from '@/convex/analytics';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Hospitality owner declines a pending partnership request. No quota or
 * counter impact — nothing was ever active. The requester sees the outcome
 * in their "Sent" tab.
 */
export const declinePartnershipRequest = authMutation('declinePartnershipRequest')({
	args: {
		requestId: v.id('partnershipRequests')
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		if (!CUSTOM_PARTNERSHIP_ENABLED) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		const request = await ctx.db.get(args.requestId);
		if (!request || request.hospitalityOwnerId !== ctx.userId) {
			return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_NOT_FOUND' } };
		}

		if (request.status !== 'pending') {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ALREADY_PROCESSED' }
			};
		}

		await ctx.db.patch(request._id, { status: 'declined', respondedAt: Date.now() });

		ctx.audit(AUDIT_ACTIONS.PARTNERSHIP_REQUEST_DECLINE, {
			resource: { table: 'partnershipRequests', id: request._id },
			before: { status: 'pending' },
			after: { status: 'declined' }
		});

		const [accommodation, hospitality] = await Promise.all([
			ctx.db.get(request.accommodationId),
			ctx.db.get(request.hospitalityId)
		]);

		await analytics.track(ctx, 'partnership.request.declined', {
			subject: { type: 'hospitality', id: request.hospitalityId },
			organizationId: request.hospitalityOwnerId,
			scopes: [
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('accommodationOwner', request.accommodationOwnerId)
				},
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('hospitalityOwner', request.hospitalityOwnerId)
				}
			],
			properties: {
				accommodationId: request.accommodationId,
				...(accommodation ? { accommodationName: accommodation.name } : {}),
				hospitalityId: request.hospitalityId,
				...(hospitality ? { hospitalityName: hospitality.name } : {})
			}
		});

		return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_DECLINED' } };
	}
});
