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
	[AUDIT_ACTIONS.PARTNERSHIP_DELETE]: () => m['AuditActions.partnershipDelete'](),
	[AUDIT_ACTIONS.PARTNERSHIP_REQUEST_CREATE]: () => m['AuditActions.partnershipRequestCreate'](),
	[AUDIT_ACTIONS.PARTNERSHIP_REQUEST_DECLINE]: () => m['AuditActions.partnershipRequestDecline'](),
	[AUDIT_ACTIONS.USER_PLAN_UPDATE]: () => m['AuditActions.userPlanUpdate'](),
	[AUDIT_ACTIONS.ACCOMMODATION_CREATE]: () => m['AuditActions.accommodationCreate'](),
	[AUDIT_ACTIONS.ACCOMMODATION_UPDATE]: () => m['AuditActions.accommodationUpdate'](),
	[AUDIT_ACTIONS.HOSPITALITY_CREATE]: () => m['AuditActions.hospitalityCreate'](),
	[AUDIT_ACTIONS.HOSPITALITY_UPDATE]: () => m['AuditActions.hospitalityUpdate'](),
	[AUDIT_ACTIONS.RESERVATION_CONFIRM]: () => m['AuditActions.reservationConfirm'](),
	[AUDIT_ACTIONS.RESERVATION_CANCEL]: () => m['AuditActions.reservationCancel'](),
	[AUDIT_ACTIONS.RESERVATION_NO_SHOW]: () => m['AuditActions.reservationNoShow'](),
	[AUDIT_ACTIONS.TRIAL_START]: () => m['AuditActions.trialStart'](),
	[AUDIT_ACTIONS.TRIAL_EXPIRE]: () => m['AuditActions.trialExpire']()
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
