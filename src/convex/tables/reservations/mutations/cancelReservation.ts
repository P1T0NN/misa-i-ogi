// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';

// HELPERS
import { analytics } from '@/convex/analytics';
import { reservationStatusCounterKey } from '@/convex/helpers/counterKeys';
import { transferOwnerReservationStatus } from '@/convex/helpers/ownerCounterHelpers';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import { createAnalyticsResourceScope, createAnalyticsScopeId } from '@piton-/analytics-convex';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

export const cancelReservation = authMutation('cancelReservation')({
	args: {
		reservationId: v.id('reservations')
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const reservation = await ctx.db.get(args.reservationId);
		if (!reservation || reservation.hospitalityOwnerId !== ctx.userId) {
			return { success: false, message: { key: 'GenericMessages.RESERVATION_NOT_FOUND' } };
		}

		if (reservation.status !== 'pending') {
			return { success: false, message: { key: 'GenericMessages.RESERVATION_ALREADY_PROCESSED' } };
		}

		await ctx.db.patch(args.reservationId, { status: 'cancelled' });
		await analytics.counters.bump(ctx, reservationStatusCounterKey('pending'), -1);
		await analytics.counters.bump(ctx, reservationStatusCounterKey('cancelled'), 1);
		await transferOwnerReservationStatus(
			ctx,
			reservation.hospitalityOwnerId,
			'pending',
			'cancelled'
		);

		ctx.audit(AUDIT_ACTIONS.RESERVATION_CANCEL, {
			resource: { table: 'reservations', id: args.reservationId },
			before: { status: 'pending' },
			after: { status: 'cancelled' },
			metadata: { guestName: reservation.guestName, hospitalityId: reservation.hospitalityId }
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
				reason: 'owner_cancelled'
			}
		});

		return { success: true, message: { key: 'GenericMessages.RESERVATION_CANCELLED' } };
	}
});
