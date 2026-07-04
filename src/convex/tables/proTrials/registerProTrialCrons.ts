// LIBRARIES
import type { Crons } from 'convex/server';

// TYPES
import type { internal } from '../../_generated/api';

type InternalApi = typeof internal;

export function registerProTrialCrons(crons: Crons, internalApi: InternalApi) {
	/**
	 * Hourly sweep so an expired trial's partnerships and venues go dark within
	 * the hour. Cheap: indexed scan that is empty almost every run.
	 */
	crons.hourly(
		'expire pro trials',
		{ minuteUTC: 7 },
		internalApi.tables.proTrials.crons.proTrialCron.expireProTrials,
		{}
	);
}
