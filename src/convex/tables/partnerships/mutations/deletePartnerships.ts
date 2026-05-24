// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

/**
 * Admin-only bulk delete for `partnerships` rows.
 * Audited per row when `FEATURES.AUDIT_LOGS` is enabled (`logAudit` inside `createDeleteMutation`).
 */
export const deletePartnerships = createDeleteMutation('deletePartnerships', {
	table: 'partnerships',
	phase2Strategy: 'optimized',
	audit: { action: AUDIT_ACTIONS.PARTNERSHIP_DELETE }
});
