// LIBRARIES
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';
import { m } from '@/shared/lib/paraglide/messages';

// UTILS
import { capitalize } from '@/shared/utils/stringUtils';

const AUDIT_ACTION_LABELS = {
	[AUDIT_ACTIONS.USER_CREATE]: () => m['AuditActions.userCreate'](),
	[AUDIT_ACTIONS.USER_UPDATE]: () => m['AuditActions.userUpdate'](),
	[AUDIT_ACTIONS.USER_DELETE]: () => m['AuditActions.userDelete'](),
	[AUDIT_ACTIONS.USER_ROLE_UPDATE]: () => m['AuditActions.userRoleUpdate'](),
	[AUDIT_ACTIONS.USER_BAN]: () => m['AuditActions.userBan'](),
	[AUDIT_ACTIONS.USER_UNBAN]: () => m['AuditActions.userUnban'](),
	[AUDIT_ACTIONS.USER_SESSION_REVOKE]: () => m['AuditActions.userSessionRevoke'](),
	[AUDIT_ACTIONS.USER_SESSIONS_REVOKE_ALL]: () => m['AuditActions.userSessionsRevokeAll'](),
	[AUDIT_ACTIONS.ADMIN_ACTION]: () => m['AuditActions.adminAction'](),
	[AUDIT_ACTIONS.FILE_UPLOAD]: () => m['AuditActions.fileUpload'](),
	[AUDIT_ACTIONS.FILE_DELETE]: () => m['AuditActions.fileDelete'](),
	[AUDIT_ACTIONS.PARTNERSHIP_CREATE]: () => m['AuditActions.partnershipCreate'](),
	[AUDIT_ACTIONS.PARTNERSHIP_DELETE]: () => m['AuditActions.partnershipDelete']()
} satisfies Record<(typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS], () => string>;

function humanizeAuditAction(action: string): string {
	return capitalize(action.replaceAll('.', ' ').replaceAll('_', ' '));
}

/**
 * Maps backend audit action keys (`user.role.update`, etc.) to localized labels.
 * Unknown keys fall back to a humanized action string.
 */
export function auditActionLabel(action: string): string {
	const known = AUDIT_ACTION_LABELS[action as keyof typeof AUDIT_ACTION_LABELS];
	if (known) return known();
	return m['AuditActions.unknown']({ action: humanizeAuditAction(action) });
}
