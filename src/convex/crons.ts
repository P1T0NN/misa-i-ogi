// LIBRARIES
import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

/**
 * Scheduled jobs. Convex requires this file at the convex root, default-exporting
 * the registry.
 */

const crons = cronJobs();

/**
 * Storage cleanup. Safety net for the manual-delete cases the upload pipeline
 * can't catch (rows deleted via the Convex dashboard, blobs deleted via the Cloudflare
 * R2 UI). Daily is plenty for a safety net; tighten if humans actually mess with
 * the bucket often.
 */
crons.daily(
	'cleanup R2 and uploadedFilesR2',
	{ hourUTC: 3, minuteUTC: 0 },
	internal.storage.crons.cleanupOrphanDataR2.cleanupOrphanDataR2
);

/**
 * Audit-log retention. No-op when `FEATURES.AUDIT_LOGS` is off (table will just
 * be empty). Per-action retention is configured in `tables/auditLog/auditLogActions.ts`.
 */
crons.daily(
	'purge stale audit logs',
	{ hourUTC: 4, minuteUTC: 0 },
	internal.tables.auditLog.crons.auditLogCron.purgeStaleAuditLogs,
	{}
);

export default crons;
