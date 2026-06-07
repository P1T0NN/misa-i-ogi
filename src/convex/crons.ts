// LIBRARIES
import { cronJobs } from 'convex/server';

// CONFIG
import { analytics } from './analytics';
import { internal } from './_generated/api';

// CRONS
import { registerStorageCrons } from './storage/registerStorageCrons';
import { registerAuditLogCrons } from './tables/auditLog/registerAuditLogCrons';

/**
 * Scheduled jobs. Convex requires this file at the convex root, default-exporting
 * the registry.
 */
const crons = cronJobs();

registerStorageCrons(crons, internal);
registerAuditLogCrons(crons, internal);
analytics.registerCrons(crons, internal.analytics.crons);

export default crons;
