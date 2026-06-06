// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';
import { hasActiveAccommodationHospitalityPartnership } from '@/convex/tables/partnerships/helpers/getAccommodationPartnerships';
import { getGuestPendingHospitalityReservation } from '@/convex/tables/reservations/helpers/getGuestPendingHospitalityReservation';
import { isGuestStayIdentity } from '@/convex/tables/guests/utils/isGuestStayIdentity';

// UTILS
import { authComponent } from '@/convex/auth/auth';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { HospitalityDetailsResult } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/**
 * Hospitality detail gated at the Convex boundary.
 *
 * Allowed callers:
 * - active guest stay identities
 * - admins
 * - the owner of the hospitality row
 *
 * Missing/inactive rows and unauthorized non-guest callers both return `not_found`.
 * Active guests get `not_partnered` when the hospitality exists but their current
 * accommodation does not have an active partnership with it.
 */
export const fetchHospitalityDetails = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	handler: async (ctx, args): Promise<HospitalityDetailsResult> => {
		const hospitality = await ctx.db.get(args.hospitalityId);
		if (!hospitality?.isActive) return { status: 'not_found' };

		const identity = await ctx.auth.getUserIdentity();
		const activeGuest = await getActiveGuestSessionFromAuth(ctx);
		let pendingReservation: Doc<'reservations'> | null = null;

		if (isGuestStayIdentity(identity) && !activeGuest) {
			return { status: 'not_found' };
		}

		if (activeGuest) {
			const hasGuestAccess = await hasActiveAccommodationHospitalityPartnership(
				ctx,
				activeGuest.accommodationId,
				hospitality._id
			);
			if (!hasGuestAccess) return { status: 'not_partnered' };

			pendingReservation = await getGuestPendingHospitalityReservation(
				ctx,
				activeGuest._id,
				hospitality._id
			);
		} else {
			const currentUser = await authComponent.safeGetAuthUser(ctx);
			const isAdmin = currentUser?.role === 'admin';
			const isOwner = currentUser?._id === hospitality.ownerId;

			if (!isAdmin && !isOwner) return { status: 'not_found' };
		}

		return {
			status: 'available',
			hospitality: {
				_id: hospitality._id,
				name: hospitality.name,
				type: hospitality.type,
				address: hospitality.address,
				city: hospitality.city,
				country: hospitality.country,
				description: hospitality.description,
				contactPhone: hospitality.contactPhone,
				coverImageUrl: hospitality.coverImageUrl
			},
			pendingReservation: pendingReservation
				? {
						guestName: pendingReservation.guestName,
						email: pendingReservation.email,
						phone: pendingReservation.phone,
						requestedTime: pendingReservation.requestedTime,
						status: 'pending'
					}
				: null
		};
	}
});
