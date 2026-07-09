// HELPERS
import { analytics } from '@/convex/analytics';
import {
	COUNTER_KEYS,
	RESERVATION_STATUSES,
	reservationStatusCounterKey
} from '@/convex/helpers/counterKeys';
import { bumpOwnerReservationStatus } from '@/convex/helpers/ownerCounterHelpers';
import { decrementActivePartnershipCounters } from '@/convex/tables/partnerships/helpers/decrementActivePartnershipCounters';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Id } from '@/convex/_generated/dataModel';

/**
 * Delete the rows that hang off a hospitality, keeping the analytics counters
 * honest. Called from the delete mutations' `onDelete` hook, so it shares their
 * transaction — a throw anywhere rolls the whole delete back.
 *
 * The delete mutations' `authorize` guards already reject hospitalities with an
 * ACTIVE partnership or an OPEN (pending/confirmed) reservation, so in practice
 * everything reached here is inactive / terminal. The active-partnership
 * decrement is defensive.
 *
 * Reservations decrement TWO counters per row — the global `reservations.<status>`
 * and the per-owner `reservations.owner.<ownerId>.<status>`. We scan per status
 * (via `by_hospitality_status`) so both decrements are a single batched bump of
 * `-count`, never per-row.
 */
export async function cascadeHospitalityChildren(
	ctx: MutationCtx,
	hospitalityId: Id<'hospitalities'>,
	hospitalityOwnerId: string
): Promise<void> {
	const partnerships = await ctx.db
		.query('partnerships')
		.withIndex('by_hospitality', (q) => q.eq('hospitalityId', hospitalityId))
		.collect();
	for (const partnership of partnerships) {
		await decrementActivePartnershipCounters(ctx, partnership);
		await ctx.db.delete(partnership._id);
	}
	if (partnerships.length > 0) {
		await analytics.counters.bump(ctx, COUNTER_KEYS.PARTNERSHIPS_TOTAL, -partnerships.length);
	}

	// Pending requests referencing this venue would linger forever in both owners'
	// Sent/Received tabs. No counter tracks requests — plain deletes.
	const requests = await ctx.db
		.query('partnershipRequests')
		.withIndex('by_hospitality', (q) => q.eq('hospitalityId', hospitalityId))
		.collect();
	for (const request of requests) await ctx.db.delete(request._id);

	for (const status of RESERVATION_STATUSES) {
		const reservations = await ctx.db
			.query('reservations')
			.withIndex('by_hospitality_status', (q) =>
				q.eq('hospitalityId', hospitalityId).eq('status', status)
			)
			.collect();
		if (reservations.length === 0) continue;

		for (const reservation of reservations) await ctx.db.delete(reservation._id);
		await analytics.counters.bump(ctx, reservationStatusCounterKey(status), -reservations.length);
		await bumpOwnerReservationStatus(ctx, hospitalityOwnerId, status, -reservations.length);
	}
}
