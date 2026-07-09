// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

// HELPERS
import { analytics } from '@/convex/analytics';
import {
	activePartnershipsCounterKey,
	COUNTER_KEYS,
	ownerReservationStatusCounterKey,
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

		const accommodations = await ctx.db.query('accommodations').collect();
		await analytics.counters.set(ctx, COUNTER_KEYS.ACCOMMODATIONS_TOTAL, accommodations.length);

		const hospitalities = await ctx.db.query('hospitalities').collect();
		await analytics.counters.set(ctx, COUNTER_KEYS.HOSPITALITIES_TOTAL, hospitalities.length);

		const partnerships = await ctx.db.query('partnerships').collect();
		await analytics.counters.set(ctx, COUNTER_KEYS.PARTNERSHIPS_TOTAL, partnerships.length);

		const activePartnershipIdsByUser = new Map<string, Set<string>>();
		for (const partnership of partnerships) {
			if (!partnership.isActive) continue;

			const accommodation = await ctx.db.get(partnership.accommodationId);
			const hospitality = await ctx.db.get(partnership.hospitalityId);
			if (!accommodation || !hospitality) continue;

			for (const ownerId of [accommodation.ownerId, hospitality.ownerId]) {
				const ids = activePartnershipIdsByUser.get(ownerId) ?? new Set<string>();
				ids.add(partnership._id);
				activePartnershipIdsByUser.set(ownerId, ids);
			}
		}

		for (const [userId, partnershipIds] of activePartnershipIdsByUser) {
			await analytics.counters.set(ctx, activePartnershipsCounterKey(userId), partnershipIds.size);
		}

		const reservations = await ctx.db.query('reservations').collect();
		const statusCounts: Record<string, number> = {};
		const ownerStatusCounts = new Map<string, Record<string, number>>();

		for (const status of RESERVATION_STATUSES) {
			statusCounts[status] = 0;
		}

		for (const reservation of reservations) {
			statusCounts[reservation.status] = (statusCounts[reservation.status] ?? 0) + 1;

			const ownerCounts =
				ownerStatusCounts.get(reservation.hospitalityOwnerId) ??
				Object.fromEntries(RESERVATION_STATUSES.map((status) => [status, 0]));
			ownerCounts[reservation.status] = (ownerCounts[reservation.status] ?? 0) + 1;
			ownerStatusCounts.set(reservation.hospitalityOwnerId, ownerCounts);
		}

		for (const status of RESERVATION_STATUSES) {
			await analytics.counters.set(
				ctx,
				reservationStatusCounterKey(status),
				statusCounts[status] ?? 0
			);
		}

		for (const [ownerId, counts] of ownerStatusCounts) {
			for (const status of RESERVATION_STATUSES) {
				await analytics.counters.set(
					ctx,
					ownerReservationStatusCounterKey(ownerId, status),
					counts[status] ?? 0
				);
			}
		}

		return {
			guests: guests.length,
			accommodations: accommodations.length,
			hospitalities: hospitalities.length,
			partnerships: partnerships.length,
			reservations: statusCounts,
			activePartnershipUsers: activePartnershipIdsByUser.size,
			ownerReservationCounters: ownerStatusCounts.size
		};
	}
});
