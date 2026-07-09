// HELPERS
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { decrementActivePartnershipCounters } from '@/convex/tables/partnerships/helpers/decrementActivePartnershipCounters';
import { cancelPendingReservationsForGuest } from '@/convex/tables/reservations/helpers/cancelPendingReservationsForGuest';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Id } from '@/convex/_generated/dataModel';

/**
 * Delete the rows that hang off an accommodation, keeping the analytics counters
 * honest. Called from the delete mutations' `onDelete` hook, so it shares their
 * transaction — a throw anywhere rolls the whole delete back.
 *
 * The delete mutations' `authorize` guards already reject accommodations with an
 * ACTIVE partnership or an ACTIVE guest, so in practice everything reached here
 * is inactive/expired. The active-partnership decrement is defensive: if one ever
 * slips through it keeps the owner counters correct instead of drifting.
 *
 * Bounded per accommodation (a venue has a handful of partnerships and at most a
 * few guest rows), so `.collect()` is safe here.
 */
export async function cascadeAccommodationChildren(
	ctx: MutationCtx,
	accommodationId: Id<'accommodations'>
): Promise<void> {
	const partnerships = await ctx.db
		.query('partnerships')
		.withIndex('by_accommodation', (q) => q.eq('accommodationId', accommodationId))
		.collect();
	for (const partnership of partnerships) {
		await decrementActivePartnershipCounters(ctx, partnership);
		await ctx.db.delete(partnership._id);
	}
	if (partnerships.length > 0) {
		await analytics.counters.bump(ctx, COUNTER_KEYS.PARTNERSHIPS_TOTAL, -partnerships.length);
	}

	// Pending requests referencing this accommodation would linger forever in both
	// owners' Sent/Received tabs. No counter tracks requests — plain deletes.
	const requests = await ctx.db
		.query('partnershipRequests')
		.withIndex('by_accommodation', (q) => q.eq('accommodationId', accommodationId))
		.collect();
	for (const request of requests) await ctx.db.delete(request._id);

	const guests = await ctx.db
		.query('guests')
		.withIndex('by_accommodation_expires', (q) => q.eq('accommodationId', accommodationId))
		.collect();
	for (const guest of guests) {
		// Their pending reservations at OTHER owners' venues can never be honoured
		// once the guest is gone — system-cancel them (terminal rows stay).
		await cancelPendingReservationsForGuest(ctx, guest._id);
		await ctx.db.delete(guest._id);
	}
	if (guests.length > 0) {
		await analytics.counters.bump(ctx, COUNTER_KEYS.GUESTS_TOTAL, -guests.length);
	}
}
