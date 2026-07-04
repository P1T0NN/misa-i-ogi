/**
 * Closed registry of audit action keys.
 *
 * Add new actions here — `as const` keeps the union narrow so typos at call
 * sites become compile errors and downstream filters (admin UI, retention
 * rules) can exhaustively switch over the values.
 *
 * Convention: `domain.entity.verb` (lowercase, dotted). Keep stable — these
 * strings live in the database and any rename is a data migration.
 *
 * When adding an action, consider whether the 90-day default retention fits;
 * override it in {@link AUDIT_RETENTION_DAYS} below if not.
 */
export const AUDIT_ACTIONS = {
	// Auth / users
	USER_CREATE: 'user.create',
	USER_UPDATE: 'user.update',
	USER_DELETE: 'user.delete',
	USER_ROLE_UPDATE: 'user.role.update',
	USER_BAN: 'user.ban',
	USER_UNBAN: 'user.unban',
	USER_SESSION_REVOKE: 'user.session.revoke',
	USER_SESSIONS_REVOKE_ALL: 'user.sessions.revoke_all',
	USER_PLAN_UPDATE: 'user.plan.update',

	// Generic admin
	ADMIN_ACTION: 'admin.action',

	// Files
	FILE_UPLOAD: 'file.upload',
	FILE_DELETE: 'file.delete',

	// Partnerships
	PARTNERSHIP_CREATE: 'partnership.create',
	PARTNERSHIP_DELETE: 'partnership.delete',
	PARTNERSHIP_REQUEST_CREATE: 'partnership.request.create',
	PARTNERSHIP_REQUEST_DECLINE: 'partnership.request.decline',

	// Accommodations
	ACCOMMODATION_CREATE: 'accommodation.create',
	ACCOMMODATION_UPDATE: 'accommodation.update',

	// Hospitalities
	HOSPITALITY_CREATE: 'hospitality.create',
	HOSPITALITY_UPDATE: 'hospitality.update',
	HOSPITALITY_VISIBILITY_UPDATE: 'hospitality.visibility.update',

	// Reservations (owner-side state transitions; guest-side create is analytics-only)
	RESERVATION_CONFIRM: 'reservation.confirm',
	RESERVATION_CANCEL: 'reservation.cancel',
	RESERVATION_NO_SHOW: 'reservation.no_show',

	// Pro trial
	TRIAL_START: 'trial.start',
	TRIAL_EXPIRE: 'trial.expire'
} as const;

/**
 * Per-action retention in days. Anything not listed falls back to
 * `AUDIT_RETENTION_DEFAULT_DAYS`. Set to `Infinity` to keep forever.
 *
 * Tune per project: noisy actions short, security-critical actions long.
 */
export const AUDIT_RETENTION_DEFAULT_DAYS = 90;

export const AUDIT_RETENTION_DAYS: Partial<Record<AuditAction, number>> = {
	'user.create': 365 * 5,
	'user.role.update': 365 * 5,
	'user.delete': 365 * 5,
	'user.ban': 365 * 5,
	'user.unban': 365 * 5,
	'user.session.revoke': 365 * 5,
	'user.sessions.revoke_all': 365 * 5
};

/**
 * Hand-written call sites should use {@link AUDIT_ACTIONS} members and get
 * autocomplete; factory-generated keys (e.g. `createDeleteMutation`'s default
 * `${table}.delete`) are accepted as raw strings via the `(string & {})` trick
 * — TS keeps the literal union for autocomplete while still accepting any string.
 */
export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS] | (string & {});
