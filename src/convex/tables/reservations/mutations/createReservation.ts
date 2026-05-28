// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';
import { hasActiveAccommodationHospitalityPartnership } from '@/convex/tables/partnerships/helpers/getAccommodationPartnerships';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

// UTILS
import {
	normalizeOptionalEmail,
	normalizeRequiredString,
	normalizeRequiredTime24h
} from '@/convex/utils/convexValidationUtils';

const MAX_GUEST_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 64;

type ReservationInput = {
	guestName: string;
	phone: string;
	requestedTime: string;
	email?: string;
};

function validateReservationInput(args: ReservationInput) {
	const guestName = normalizeRequiredString(args.guestName, { maxLength: MAX_GUEST_NAME_LENGTH });
	const requestedTime = normalizeRequiredTime24h(args.requestedTime);
	const phone = normalizeRequiredString(args.phone, { maxLength: MAX_PHONE_LENGTH });
	const email = normalizeOptionalEmail(args.email);

	if (!guestName || !requestedTime || !phone || email === null) return null;

	return { guestName, requestedTime, phone, email };
}

/**
 * Guest-only: submit a reservation request to a hospitality venue.
 *
 * The guest must be authenticated via the QR stay flow — their `guestId`
 * and `accommodationId` are pulled from the auth context, not passed as args.
 *
 * On success the reservation is created with `status: 'pending'` — owners
 * review and confirm/cancel manually.
 */
export const createReservation = mutation({
	args: {
		hospitalityId: v.id('hospitalities'),
		guestName: v.string(),
		phone: v.string(),
		requestedTime: v.string(),
		email: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const input = validateReservationInput(args);
		if (!input) {
			return {
				success: false,
				message: { key: 'GenericMessages.YOU_NEED_TO_CORRECT_FORM_ERRORS' }
			};
		}

		const guest = await getActiveGuestSessionFromAuth(ctx);
		if (!guest) {
			return {
				success: false,
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			};
		}

		const hospitality = await ctx.db.get(args.hospitalityId);
		const hasGuestAccess = await hasActiveAccommodationHospitalityPartnership(
			ctx,
			guest.accommodationId,
			args.hospitalityId
		);
		if (!hospitality?.isActive || !hasGuestAccess) {
			return {
				success: false,
				message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' }
			};
		}

		await ctx.db.insert('reservations', {
			hospitalityId: args.hospitalityId,
			hospitalityName: hospitality.name,
			hospitalityOwnerId: hospitality.ownerId,
			guestId: guest._id,
			accommodationId: guest.accommodationId,
			guestName: input.guestName,
			email: input.email,
			phone: input.phone,
			requestedTime: input.requestedTime,
			status: 'pending'
		});

		return {
			success: true,
			message: { key: 'GenericMessages.RESERVATION_CREATED' }
		};
	}
});
