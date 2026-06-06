// LIBRARIES
import { cronJobs } from 'convex/server';

// CONFIG
import { internal } from './_generated/api';

// CRONS
// TODO: Re-enable once Convex supports child-component crons.
// import { registerAnalyticsCrons } from '@piton-/analytics-convex';
import { registerStorageCrons } from './storage/registerStorageCrons';
import { registerAuditLogCrons } from './tables/auditLog/registerAuditLogCrons';

/**
 * Scheduled jobs. Convex requires this file at the convex root, default-exporting
 * the registry.
 */
const crons = cronJobs();

registerStorageCrons(crons, internal);
registerAuditLogCrons(crons, internal);
// TODO: registerAnalyticsCrons(crons, components.analytics);

export default crons;
