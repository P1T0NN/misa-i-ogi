// LIBRARIES
import { cronJobs } from 'convex/server';

// CONFIG
import { analytics } from './analytics';
import { internal } from './_generated/api';

// CRONS
import { registerStorageCrons } from './storage/registerStorageCrons';
import { registerAuditLogCrons } from './tables/auditLog/registerAuditLogCrons';
import { registerProTrialCrons } from './tables/proTrials/registerProTrialCrons';

/**
 * Scheduled jobs. Convex requires this file at the convex root, default-exporting
 * the registry.
 */
const crons = cronJobs();

registerStorageCrons(crons, internal);
registerAuditLogCrons(crons, internal);
registerProTrialCrons(crons, internal);
analytics.registerCrons(crons, internal.analytics);

export default crons;
