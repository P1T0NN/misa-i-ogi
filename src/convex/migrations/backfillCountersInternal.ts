// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

// HELPERS
import { analytics } from '@/convex/analytics';
import {
	COUNTER_KEYS,
	RESERVATION_STATUSES,
	reservationStatusCounterKey
} from '@/convex/helpers/counterKeys';

/**
 * One-off backfill/repair for `analytics.counters` — scans the counted tables
 * once and overwrites the counters with table truth. Safe to re-run any time
 * (e.g. after a bug in a bump call site caused drift).
 *
 * Run: bunx convex run migrations/backfillCountersInternal:backfillCounters
 */
export const backfillCounters = internalMutation({
	args: {},
	handler: async (ctx) => {
		const guests = await ctx.db.query('guests').collect();
		await analytics.counters.set(ctx, COUNTER_KEYS.GUESTS_TOTAL, guests.length);

		const statusCounts: Record<string, number> = {};
		for (const status of RESERVATION_STATUSES) {
			const rows = await ctx.db
				.query('reservations')
				.withIndex('by_status', (q) => q.eq('status', status))
				.collect();
			await analytics.counters.set(ctx, reservationStatusCounterKey(status), rows.length);
			statusCounts[status] = rows.length;
		}

		return { guests: guests.length, reservations: statusCounts };
	}
});
