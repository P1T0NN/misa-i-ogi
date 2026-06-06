// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import {
	createAnalyticsResourceScopeId,
	createAnalyticsScopeId
} from '@piton-/analytics-convex';

/**
 * Admin-only bulk delete for `partnerships` rows.
 * Audited per row when `FEATURES.AUDIT_LOGS` is enabled (`logAudit` inside `createDeleteMutation`).
 */
export const deletePartnerships = createDeleteMutation('deletePartnerships', {
	table: 'partnerships',
	phase2Strategy: 'optimized',
	analytics: async (ctx, partnership, meta) => {
		const [accommodation, hospitality] = await Promise.all([
			ctx.db.get(partnership.accommodationId),
			ctx.db.get(partnership.hospitalityId)
		]);

		return {
			name: 'partnership.deactivated',
			...(accommodation ? { organizationId: accommodation.ownerId } : {}),
			scopes: [
				...(hospitality
					? [{ scopeType: 'organization' as const, scopeId: hospitality.ownerId }]
					: []),
				...(accommodation
					? [
							{
								scopeType: 'organization' as const,
								scopeId: createAnalyticsScopeId(
									'accommodationOwner',
									accommodation.ownerId
								)
							}
						]
					: []),
				...(hospitality
					? [
							{
								scopeType: 'organization' as const,
								scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
							}
						]
					: []),
				{
					scopeType: 'resource' as const,
					scopeId: createAnalyticsResourceScopeId('hospitality', partnership.hospitalityId)
				}
			],
			properties: {
				accommodationId: partnership.accommodationId,
				...(accommodation ? { accommodationName: accommodation.name } : {}),
				hospitalityId: partnership.hospitalityId,
				...(hospitality ? { hospitalityName: hospitality.name } : {}),
				partnershipDelta: -1
			}
		};
	},
	audit: { action: AUDIT_ACTIONS.PARTNERSHIP_DELETE }
});
