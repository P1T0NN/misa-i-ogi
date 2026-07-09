// TYPES
import type { Crons } from 'convex/server';
import type { internal } from '../../_generated/api';

type InternalApi = typeof internal;

export function registerGuestCrons(crons: Crons, internalApi: InternalApi) {
	/**
	 * Daily sweep of expired guest sessions. Cheap: an indexed range scan that is
	 * usually empty because `createGuest` already GCs per accommodation on scan.
	 * Staggered off the other daily sweeps so they don't fight for a mutation slot.
	 */
	crons.daily(
		'expire guest sessions',
		{ hourUTC: 3, minuteUTC: 30 },
		internalApi.tables.guests.crons.expireGuestsCron.expireGuests,
		{}
	);
}
