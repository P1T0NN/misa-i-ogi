// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { analytics } from '@/convex/analytics';

// UTILS
import {
	createAnalyticsResourceScopeId,
	createAnalyticsScopeId
} from '@piton-/analytics-convex';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

export const confirmReservation = mutation({
	args: {
		reservationId: v.id('reservations')
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const ownerId = await getAuthUserId(ctx);
		if (!ownerId) {
			return { success: false, message: { key: 'GenericMessages.NOT_AUTHENTICATED' } };
		}

		const reservation = await ctx.db.get(args.reservationId);
		if (!reservation || reservation.hospitalityOwnerId !== ownerId) {
			return { success: false, message: { key: 'GenericMessages.RESERVATION_NOT_FOUND' } };
		}

		if (reservation.status !== 'pending') {
			return { success: false, message: { key: 'GenericMessages.RESERVATION_ALREADY_PROCESSED' } };
		}

		await ctx.db.patch(args.reservationId, { status: 'confirmed' });

		const [hospitality, accommodation] = await Promise.all([
			ctx.db.get(reservation.hospitalityId),
			ctx.db.get(reservation.accommodationId)
		]);

		await analytics.writeTrack(ctx, {
			name: 'reservation.confirmed',
			organizationId: reservation.hospitalityOwnerId,
			scopes: [
				...(accommodation
					? [{ scopeType: 'organization' as const, scopeId: accommodation.ownerId }]
					: []),
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId(
						'hospitalityOwner',
						reservation.hospitalityOwnerId
					)
				},
				...(accommodation
					? [
							{
								scopeType: 'organization' as const,
								scopeId: createAnalyticsScopeId(
									'accommodationOwner',
									accommodation.ownerId
								)
							}
						]
					: []),
				{
					scopeType: 'resource',
					scopeId: createAnalyticsResourceScopeId('accommodation', reservation.accommodationId)
				}
			],
			properties: {
				hospitalityId: reservation.hospitalityId,
				hospitalityName: hospitality?.name ?? reservation.hospitalityName,
				...(hospitality ? { hospitalityType: hospitality.type } : {}),
				accommodationId: reservation.accommodationId,
				...(accommodation ? { accommodationName: accommodation.name } : {})
			}
		});

		return { success: true, message: { key: 'GenericMessages.RESERVATION_CONFIRMED' } };
	}
});
