// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';
import { enforceRateLimit } from '@/convex/rateLimits/enforceRateLimit';
import { rateLimitKey } from '@/convex/rateLimits/keys';

// HELPERS
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';
import { hasActiveAccommodationHospitalityPartnership } from '@/convex/tables/partnerships/helpers/getAccommodationPartnerships';
import { getGuestActiveHospitalityReservation } from '@/convex/tables/reservations/helpers/getGuestActiveHospitalityReservation';
import { sendReservationEmailToHospitalityOwner } from '@/convex/tables/reservations/emails/sendReservationEmailToHospitalityOwner';
import { sendReservationEmailToGuest } from '@/convex/tables/reservations/emails/sendReservationEmailToGuest';
import { analytics } from '@/convex/analytics';
import { reservationStatusCounterKey } from '@/convex/helpers/counterKeys';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

// UTILS
import { createAnalyticsResourceScope, createAnalyticsScopeId } from '@piton-/analytics-convex';
import {
	normalizeOptionalEmail,
	normalizeRequiredPositiveInteger,
	normalizeRequiredString,
	normalizeRequiredTime24h
} from '@/convex/utils/convexValidationUtils';

const MAX_GUEST_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 64;
const MIN_GUEST_COUNT = 1;
const MAX_GUEST_COUNT = 50;

type ReservationInput = {
	guestName: string;
	guestCount: number;
	phone: string;
	requestedTime: string;
	email?: string;
};

function validateReservationInput(args: ReservationInput) {
	const guestName = normalizeRequiredString(args.guestName, { maxLength: MAX_GUEST_NAME_LENGTH });
	const guestCount = normalizeRequiredPositiveInteger(args.guestCount, {
		min: MIN_GUEST_COUNT,
		max: MAX_GUEST_COUNT
	});
	const requestedTime = normalizeRequiredTime24h(args.requestedTime);
	const phone = normalizeRequiredString(args.phone, { maxLength: MAX_PHONE_LENGTH });
	const email = normalizeOptionalEmail(args.email);

	if (!guestName || guestCount === null || !requestedTime || !phone || email === null) return null;

	return { guestName, guestCount, requestedTime, phone, email };
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
		guestCount: v.number(),
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

		// Per-guest-session bucket — this endpoint fans out emails, keep it tight.
		await enforceRateLimit(ctx, 'createReservation', rateLimitKey.guest(guest._id));

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

		const existingActiveReservation = await getGuestActiveHospitalityReservation(
			ctx,
			guest._id,
			args.hospitalityId
		);
		if (existingActiveReservation) {
			return {
				success: true,
				message: { key: 'GenericMessages.RESERVATION_CREATED' }
			};
		}

		await ctx.db.insert('reservations', {
			hospitalityId: args.hospitalityId,
			hospitalityName: hospitality.name,
			hospitalityOwnerId: hospitality.ownerId,
			guestId: guest._id,
			accommodationId: guest.accommodationId,
			guestName: input.guestName,
			...(input.email ? { email: input.email } : {}),
			phone: input.phone,
			guestCount: input.guestCount,
			requestedTime: input.requestedTime,
			status: 'pending'
		});
		await analytics.counters.bump(ctx, reservationStatusCounterKey('pending'), 1);

		const accommodation = await ctx.db.get(guest.accommodationId);
		if (accommodation) {
			await analytics.track(ctx, 'reservation.created', {
				subject: { type: 'hospitality', id: hospitality._id },
				organizationId: hospitality.ownerId,
				scopes: [
					{ scopeType: 'organization', scopeId: accommodation.ownerId },
					{
						scopeType: 'organization',
						scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
					},
					{
						scopeType: 'organization',
						scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
					},
					createAnalyticsResourceScope('accommodation', accommodation._id)
				],
				properties: {
					hospitalityId: hospitality._id,
					hospitalityName: hospitality.name,
					hospitalityType: hospitality.type,
					accommodationId: accommodation._id,
					accommodationName: accommodation.name
				}
			});
		}

		await sendReservationEmailToHospitalityOwner(ctx, {
			hospitality,
			guestName: input.guestName,
			guestCount: input.guestCount,
			phone: input.phone,
			requestedTime: input.requestedTime,
			...(input.email ? { guestEmail: input.email } : {})
		});

		if (input.email) {
			await sendReservationEmailToGuest(ctx, {
				guestEmail: input.email,
				hospitalityName: hospitality.name,
				guestName: input.guestName,
				guestCount: input.guestCount,
				phone: input.phone,
				requestedTime: input.requestedTime
			});
		}

		return {
			success: true,
			message: { key: 'GenericMessages.RESERVATION_CREATED' }
		};
	}
});
