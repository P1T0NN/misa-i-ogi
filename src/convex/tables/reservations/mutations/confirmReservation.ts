// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

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

		return { success: true, message: { key: 'GenericMessages.RESERVATION_CONFIRMED' } };
	}
});
