// LIBRARIES
import { createAnalyticsResourceScope, createAnalyticsScopeId } from '@piton-/analytics-convex';

// HELPERS
import { analytics } from '@/convex/analytics';
import { reservationStatusCounterKey } from '@/convex/helpers/counterKeys';
import { transferOwnerReservationStatus } from '@/convex/helpers/ownerCounterHelpers';
import { logAudit } from '@/convex/tables/auditLog/helpers/logAudit';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Id } from '@/convex/_generated/dataModel';

/**
 * System-cancel the PENDING reservations of a guest whose session row is being
 * deleted (expiry cron, lazy re-scan cleanup, accommodation cascade). Without
 * this, venue owners keep "pending" requests from guests who can no longer show
 * up, and the pending counters stay inflated until someone acts manually.
 *
 * Terminal rows (confirmed/cancelled/no_show) are untouched — they are the
 * owner's history and keep the guest's denormalized name/phone.
 *
 * Mirrors `cancelReservation`'s counter/audit/analytics shape, with
 * `reason: 'guest_expired'` so dashboards can tell system cancellations from
 * owner cancellations. Bounded: a guest has at most a handful of reservations.
 */
export async function cancelPendingReservationsForGuest(
	ctx: MutationCtx,
	guestId: Id<'guests'>
): Promise<void> {
	const reservations = await ctx.db
		.query('reservations')
		.withIndex('by_guest_hospitality_status', (q) => q.eq('guestId', guestId))
		.collect();

	for (const reservation of reservations) {
		if (reservation.status !== 'pending') continue;

		await ctx.db.patch(reservation._id, { status: 'cancelled' });
		await analytics.counters.bump(ctx, reservationStatusCounterKey('pending'), -1);
		await analytics.counters.bump(ctx, reservationStatusCounterKey('cancelled'), 1);
		await transferOwnerReservationStatus(
			ctx,
			reservation.hospitalityOwnerId,
			'pending',
			'cancelled'
		);

		logAudit(ctx, AUDIT_ACTIONS.RESERVATION_CANCEL, {
			resource: { table: 'reservations', id: reservation._id },
			before: { status: 'pending' },
			after: { status: 'cancelled' },
			metadata: {
				initiatedBy: 'system_guest_expired',
				guestName: reservation.guestName,
				hospitalityId: reservation.hospitalityId
			}
		});

		const [hospitality, accommodation] = await Promise.all([
			ctx.db.get(reservation.hospitalityId),
			ctx.db.get(reservation.accommodationId)
		]);

		await analytics.track(ctx, 'reservation.cancelled', {
			subject: { type: 'hospitality', id: reservation.hospitalityId },
			organizationId: reservation.hospitalityOwnerId,
			scopes: [
				...(accommodation
					? [{ scopeType: 'organization' as const, scopeId: accommodation.ownerId }]
					: []),
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('hospitalityOwner', reservation.hospitalityOwnerId)
				},
				...(accommodation
					? [
							{
								scopeType: 'organization' as const,
								scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
							}
						]
					: []),
				createAnalyticsResourceScope('accommodation', reservation.accommodationId)
			],
			properties: {
				hospitalityId: reservation.hospitalityId,
				hospitalityName: hospitality?.name ?? reservation.hospitalityName,
				...(hospitality ? { hospitalityType: hospitality.type } : {}),
				accommodationId: reservation.accommodationId,
				...(accommodation ? { accommodationName: accommodation.name } : {}),
				reason: 'guest_expired'
			}
		});
	}
}
