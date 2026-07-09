// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { decrementActivePartnershipCounters } from '@/convex/tables/partnerships/helpers/decrementActivePartnershipCounters';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

/**
 * Admin-only bulk delete for `partnerships` rows.
 * Audited per row when `FEATURES.AUDIT_LOGS` is enabled (`logAudit` inside `createDeleteMutation`).
 */
export const deletePartnerships = createDeleteMutation('deletePartnerships', {
	table: 'partnerships',
	totalCounterKey: COUNTER_KEYS.PARTNERSHIPS_TOTAL,
	// MUST be sequential: `onDelete` below read-modify-writes per-owner counter
	// keys, and two partnerships sharing an owner would lose updates under the
	// parallel `optimized` strategy (subtract 1 total instead of N).
	phase2Strategy: 'sequential',
	// Keep the per-owner active/custom counters in step with `revokePartnership`.
	// `totalCounterKey` above only handles PARTNERSHIPS_TOTAL; the owner-scoped
	// counters the dashboards read are decremented here, once per removed row.
	onDelete: (ctx, partnership) => decrementActivePartnershipCounters(ctx, partnership),
	analytics: async (ctx, partnership) => {
		const [accommodation, hospitality] = await Promise.all([
			ctx.db.get(partnership.accommodationId),
			ctx.db.get(partnership.hospitalityId)
		]);

		return {
			name: 'partnership.deactivated',
			subject: { type: 'hospitality', id: partnership.hospitalityId },
			...(accommodation ? { organizationId: accommodation.ownerId } : {}),
			scopes: [
				...(hospitality
					? [{ scopeType: 'organization' as const, scopeId: hospitality.ownerId }]
					: []),
				...(accommodation
					? [
							{
								scopeType: 'organization' as const,
								scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
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
					: [])
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
