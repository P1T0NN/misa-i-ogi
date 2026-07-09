// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// CONFIG
import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';

// HELPERS
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS, customPartnershipsCounterKey } from '@/convex/helpers/counterKeys';
import { bumpActivePartnershipsForOwners } from '@/convex/helpers/ownerCounterHelpers';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/** Either owner ends an active link. Hard-deletes so the pair can connect again. */
export const revokePartnership = authMutation('revokePartnership')({
	args: {
		partnershipId: v.id('partnerships')
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		if (!CUSTOM_PARTNERSHIP_ENABLED) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		const partnership = await ctx.db.get(args.partnershipId);
		if (!partnership?.isActive) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		const [accommodation, hospitality] = await Promise.all([
			ctx.db.get(partnership.accommodationId),
			ctx.db.get(partnership.hospitalityId)
		]);
		if (!accommodation || !hospitality) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		if (accommodation.ownerId !== ctx.userId && hospitality.ownerId !== ctx.userId) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		await ctx.db.delete(partnership._id);
		await analytics.counters.bump(ctx, COUNTER_KEYS.PARTNERSHIPS_TOTAL, -1);
		await bumpActivePartnershipsForOwners(ctx, accommodation.ownerId, hospitality.ownerId, -1);

		if (partnership.createType === 'custom') {
			await analytics.counters.bump(ctx, customPartnershipsCounterKey(accommodation.ownerId), -1);
		}

		ctx.audit(AUDIT_ACTIONS.PARTNERSHIP_DELETE, {
			resource: { table: 'partnerships', id: partnership._id },
			before: {
				accommodationId: partnership.accommodationId,
				hospitalityId: partnership.hospitalityId,
				isActive: true,
				createType: partnership.createType ?? 'platform'
			}
		});

		await analytics.track(ctx, 'partnership.deactivated', {
			subject: { type: 'hospitality', id: partnership.hospitalityId },
			...(accommodation ? { organizationId: accommodation.ownerId } : {}),
			scopes: [
				...(hospitality
					? [{ scopeType: 'organization' as const, scopeId: hospitality.ownerId }]
					: []),
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
				accommodationId: partnership.accommodationId,
				accommodationName: accommodation.name,
				hospitalityId: partnership.hospitalityId,
				hospitalityName: hospitality.name,
				partnershipDelta: -1
			}
		});

		return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REVOKED' } };
	}
});
