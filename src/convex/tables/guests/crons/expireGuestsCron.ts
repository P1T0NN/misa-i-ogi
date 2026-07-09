// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';
import { internal } from '@/convex/_generated/api';

// HELPERS
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { cancelPendingReservationsForGuest } from '@/convex/tables/reservations/helpers/cancelPendingReservationsForGuest';

/** How many expired rows one transaction clears before handing off to the next. */
const SWEEP_BATCH_SIZE = 200;

/**
 * Delete guest rows whose stay has expired, keeping `GUESTS_TOTAL` truthful.
 *
 * `createGuest` already clears expired rows for an accommodation on its next
 * scan, so this is the steady-state safety net for accommodations that are never
 * re-scanned (or were deleted) — without it, `guests.total` on the admin
 * dashboard drifts upward forever.
 *
 * Pages in bounded batches and reschedules itself while a full batch comes back,
 * so a large backlog clears across several transactions instead of one unbounded
 * mutation.
 */
export const expireGuests = internalMutation({
	args: {},
	handler: async (ctx) => {
		const now = Date.now();

		const expired = await ctx.db
			.query('guests')
			.withIndex('by_expires', (q) => q.lt('expiresAt', now))
			.take(SWEEP_BATCH_SIZE);

		for (const guest of expired) {
			// A gone guest can't show up — cancel their still-pending reservation
			// requests so owners' pending lists and counters stay truthful.
			await cancelPendingReservationsForGuest(ctx, guest._id);
			await ctx.db.delete(guest._id);
		}
		if (expired.length > 0) {
			await analytics.counters.bump(ctx, COUNTER_KEYS.GUESTS_TOTAL, -expired.length);
		}

		// A full batch means there may be more; continue on a fresh transaction.
		if (expired.length === SWEEP_BATCH_SIZE) {
			await ctx.scheduler.runAfter(
				0,
				internal.tables.guests.crons.expireGuestsCron.expireGuests,
				{}
			);
		}

		return { deleted: expired.length };
	}
});
